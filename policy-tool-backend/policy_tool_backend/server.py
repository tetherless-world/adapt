# policy-tool-backend/app.py
import glob
import json
import logging
import os
import pathlib
from collections import defaultdict
from operator import itemgetter

import rdflib
from flask import Flask, jsonify, request
from rdflib import BNode, Graph, Literal, URIRef
from twks.client import TwksClient
from twks.nanopub import Nanopublication

from .wrappers import TwksClientWrapper
from .models.data import Attribute
from .models.dtos import PolicyPostDTO, RequestPostDTO
from .rdf import prov
from .rdf.classes import (AgentRestriction, AttributeRestriction, BooleanClass,
                          BooleanOperation, Class, Graphable,
                          RestrictedDatatype, Restriction, RestrictionKind, 
                          StartTimeRestriction, ValueRestriction, EndTimeRestriction)
from .rdf.common import OWL, POL, PROV, RDF, REQ, SIO, SKOS, XSD, RDFS, graph_factory

# ==============================================================================
# SETUP
# ==============================================================================

logger = logging.getLogger(__name__)


def app_factory(config):
    app = Flask(__name__)
    app.config.from_object(config)

    api_url = app.config['API_URL']
    twks = TwksClientWrapper(server_base_url=app.config['TWKS_URL'])

    @app.before_first_request
    def load_ontologies():
        twks.load_ontologies(app.config['ONTOLOGY_PATH'])

    @app.route('/')
    def index():
        return 'Hello there!'

    @app.route('/test')
    def test():
        return jsonify([a.__dict__ for a in twks.query_attributes()])

    @app.route(f'{api_url}/attributes', methods=['GET'])
    def get_attributes():
        attributes = twks.query_attributes()
        node_dict = {}

        for attr in attributes:
            # format the output from query into separate attribute nodes
            if attr.uri not in node_dict:
                node_dict[attr.uri] = defaultdict(list)
                node_dict[attr.uri]['@id'] = attr.uri
                node_dict[attr.uri]['label'] = attr.label

            if attr.property == 'http://semanticscience.org/resource/hasAttribute':
                node_dict[attr.uri]['attributes'].append({'@id': attr.range})

            if attr.property in ['http://semanticscience.org/resource/hasValue',
                                 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type']:
                node_dict[attr.uri]['values'].append({
                    '@type': attr.range,
                    '@value': None
                })

        # construct a list of valid attributes and option-map
        # for class-like attributes
        valid_attributes = []
        options_map = {}

        def dfs(node):
            # dfs for constructing the attribute tree
            if 'values' in node:
                if node['values'][0]['@type'] == 'http://www.w3.org/2002/07/owl#Class':
                    options = twks.query_rdfs_subclasses(node['@id'])
                    if not options:
                        # filter owl:Class types without options
                        return
                    options_map[node['@id']] = options

            elif 'attributes' in node:
                node['attributes'] = [dfs(node_dict[n['@id']])
                                      for n in node['attributes']
                                      if n['@id'] in node_dict]
            return node

        for node in node_dict.values():
            attribute = {}
            tree = dfs(node)
            if tree:
                attribute['@id'] = tree['@id']
                attribute['label'] = tree['label']
                attribute['default'] = tree
                valid_attributes.append(attribute)

        # append prov attributes
        for attr in [prov.startTime, prov.endTime, prov.Agent]:
            valid_attributes.append(attr)

        options_map[prov.Agent['@id']] = \
            twks.query_rdfs_subclasses(prov.Agent['@id'])

        return jsonify({'attributes': valid_attributes, 'options': options_map})

    @app.route(f'{api_url}/requestattributes', methods=['GET'])
    def get_request_attributes():
        logging.info('Getting request attributes')

        attributes = get_attributes()

        response_data = json.loads(attributes.get_data())

        response_data['attributes'].append(prov.Action)
        response_data['options'][prov.Action['@id']] = get_actions()

        return jsonify({
            'attributes': response_data['attributes'],
            'options': response_data['options']
        })

    @app.route(f'{api_url}/actions', methods=['GET'])
    def get_actions():
        logging.info('Getting actions')
        return twks.query_rdf_type('http://www.w3.org/ns/prov#Activity')

    @app.route(f'{api_url}/precedences', methods=['GET'])
    def get_precedences():
        logging.info('Getting precedences')
        return sorted(twks.query_rdfs_subclasses('http://purl.org/twc/policy/Precedence'),
                      key=itemgetter('label'))

    @app.route(f'{api_url}/effects', methods=['GET'])
    def get_effects():
        logging.info('Getting effects')
        return twks.query_rdf_type('http://purl.org/twc/policy/Effect')

    @app.route(f'{api_url}/obligations', methods=['GET'])
    def get_obligations():
        logging.info('Getting obligations')
        return twks.query_rdf_type('http://purl.org/twc/policy/Obligation')

    @app.route(f'{api_url}/conditions', methods=['GET'])
    def get_conditions():
        logging.info('Getting conditions')
        return {
            'actions': get_actions(),
            'precedences': get_precedences(),
            'effects': get_effects(),
            'obligations': get_obligations()
        }

    def build_policy(policy: PolicyPostDTO):

        def dfs(a: dict) -> Graphable:
            id_ = URIRef(a['@id'])
            if 'attributes' in a:
                children = [dfs(c) for c in a['attributes']]
                rest_val = BooleanClass(BooleanOperation.INTERSECTION, [id_, *children])
                return AttributeRestriction(RestrictionKind.SOME_VALUES_FROM, rest_val)

            if 'values' in a and len(a['values']) == 1:
                value_, type_ = [a['values'][0][k] for k in ['@value', '@type']]

                # prov values
                if id_ == PROV.Agent:
                    return AgentRestriction(RestrictionKind.SOME_VALUES_FROM, URIRef(value_))

                if id_ == PROV.startTime:
                    return StartTimeRestriction(RestrictionKind.HAS_VALUE, Literal(value_, datatype=type_))

                if id_ == PROV.endTime:
                    return EndTimeRestriction(RestrictionKind.HAS_VALUE, Literal(value_, datatype=type_))

                rest_val_members = [id_]
                if type_ == OWL.Class:
                    rest_val_members.append(AttributeRestriction(RestrictionKind.SOME_VALUES_FROM, URIRef(value_)))
                else:
                    # assumes xsd datatype from here on
                    is_maximal = twks.query_is_subclass(id_, SIO.MaximalValue)
                    is_minimal = twks.query_is_subclass(id_, SIO.MinimalValue)

                    with_rest = []

                    if is_minimal:
                        with_rest.append((XSD.minInclusive, Literal(value_, datatype=type_)))
                    
                    if is_maximal:
                        with_rest.append((XSD.maxInclusive, Literal(value_, datatype=type_)))

                    if len(with_rest) == 0:
                        rest_val_members.append(ValueRestriction(RestrictionKind.HAS_VALUE,
                                                                 Literal(value_, datatype=type_)))
                    else:
                        rest_val_members.append(ValueRestriction(RestrictionKind.SOME_VALUES_FROM,
                                                                 RestrictedDatatype(type_, with_rest)))

                return AttributeRestriction(RestrictionKind.SOME_VALUES_FROM,
                                            BooleanClass(BooleanOperation.INTERSECTION, rest_val_members))
            else:
                raise RuntimeError('Invalid attribute structure.')
        
        source = policy.source if policy.source else 'http://purl.org/twc/policy'
        identifier = f'{source}#{policy.id}'
        
        was_assoc_members = [dfs(a) for a in policy.attributes]
        eq_agent = AgentRestriction(RestrictionKind.SOME_VALUES_FROM, 
                                    BooleanClass(BooleanOperation.INTERSECTION, 
                                                 was_assoc_members))

        eq_class = BooleanClass(BooleanOperation.INTERSECTION, 
                                members=[URIRef(policy.action), eq_agent])

        super_classes = [URIRef(policy.action)]
        for effect in policy.effects:
            super_classes.append(URIRef(effect['@value']))

        for obligation in policy.obligations:
            super_classes.append(URIRef(obligation['@value']))
        
        root = Class(identifier=URIRef(identifier),
                     label=policy.label,
                     definition=policy.definition,
                     equivalent_class=eq_class,
                     subclass_of=super_classes)

        graph, _ = root.to_graph()
        return graph

    @app.route(f'{api_url}/policy', methods=['POST'])
    def create_policy():
        logging.info('Received Policy')

        data = request.json
        policy = PolicyPostDTO(data)

        graph = build_policy(policy)

        output = graph.serialize(format='pretty-xml').decode()

        logging.info(output)

        nanopublication = Nanopublication.parse_assertions(data=output, format="xml")
        twks.save(nanopublication)

        return {'output': output}

    # @app.route(f'{api_url}/request', methods=['POST'])
    # def create_request():
    #     logging.info('Received Request')

    #     data = request.json
    #     request_req = RequestPostDTO(data)

    #     graph = graph_factory()

    #     root = REQ[request_req.id]
    #     graph.add((root, RDFS['label'], Literal(request_req.label)))
    #     graph.add((root, SKOS['definition'], Literal(request_req.definition)))

    #     agent_node = BNode()

    #     for attribute in request_req.attributes:
    #         is_agent = 1 if (attribute['label'] == "Agent") else 0
    #         is_action = 1 if (attribute['label'] == "Action") else 0
    #         is_affiliation = 1 if (attribute['label'] == "Affiliation") else 0
    #         is_starttime = 1 if (attribute['label'] == "Start time") else 0
    #         is_endtime = 1 if (attribute['label'] == "End time") else 0

    #         if is_action:
    #             for value in attribute['values']:
    #                 graph.add((root, RDF['type'], URIRef(value['@value'])))
    #         elif is_starttime:
    #             for value in attribute['values']:
    #                 graph.add((root, PROV['startedAtTime'], Literal(
    #                     value['@value'], datatype=value['@type'])))
    #         elif is_endtime:
    #             for value in attribute['values']:
    #                 graph.add((root, PROV['endedAtTime'], Literal(
    #                     value['@value'], datatype=value['@type'])))
    #         elif is_agent:
    #             for value in attribute['values']:
    #                 graph.add((root, PROV['wasAssociatedWith'], agent_node))
    #                 graph.add(
    #                     (agent_node, RDF['type'], URIRef(value['@value'])))
    #         else:
    #             if 'attributes' in attribute:
    #                 c = BNode()
    #                 graph.add((c, RDF['type'], URIRef(attribute['@id'])))
    #                 for attributes in attribute['attributes']:
    #                     for value in attributes['values']:
    #                         v = BNode()
    #                         graph.add((c, SIO['hasAttribute'], v))
    #                         graph.add(
    #                             (v, RDF['type'], URIRef(attributes['@id'])))
    #                         graph.add((v, SIO['hasValue'], Literal(
    #                             value['@value'], datatype=value['@type'])))
    #                 graph.add((agent_node, SIO['hasAttribute'], c))
    #             else:
    #                 for value in attribute['values']:
    #                     v = BNode()
    #                     graph.add((agent_node, SIO['hasAttribute'], v))
    #                     graph.add((v, RDF['type'], URIRef(attribute['@id'])))
    #                     if is_affiliation:
    #                         graph.add(
    #                             (v, SIO['hasValue'], URIRef(value['@value'])))
    #                     else:
    #                         graph.add((v, SIO['hasValue'], Literal(
    #                             value['@value'], datatype=value['@type'])))

    #     output = graph.serialize(format='turtle').decode('utf-8')

    #     logging.info(output)
    #     nanopublication = Nanopublication.parse_assertions(data=output,
    #                                                     format="ttl")
    #     client.put_nanopublication(nanopublication)
    #     logging.info(f'{REQ[request_req.id]} loaded into TWKS')

    #     return {'output': output}

    return app
