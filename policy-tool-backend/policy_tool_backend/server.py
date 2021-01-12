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
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def app_factory(config):
    app = Flask(__name__)
    app.config.from_object(config)

    def default(self, o):
        try:
            s = str(o)
        except TypeError:
            pass
        else:
            return str(o)
        return JSONEncoder.default(self, o)

    app.json_encoder.default = default

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
        return get_attributes()

    @app.route(f'{api_url}/policy/attributes', methods=['GET'])
    def get_attributes():
        results = twks.query_attributes()

        # keep track of important node information
        nodes = defaultdict(lambda: defaultdict(list))
        tree = defaultdict(list)  # keep track of graph structure
        for row in results:
            if row.uri not in nodes:
                nodes[row.uri]['uri'] = row.uri
                nodes[row.uri]['label'] = row.label

                # for identifying sio:MaximalValue, sio:MinimalValue, sio:interval
                for sio_uri in [SIO.MaximalValue, SIO.MinimalValue, SIO.interval]:
                    if twks.query_is_subclass(row.uri, sio_uri):
                        nodes[row.uri]['subClassOf'].append(sio_uri)

            if row.property == SIO.hasAttribute:
                tree[row.uri].append(row.range)

            if row.property == SIO.hasValue or row.property == RDF.type:
                nodes[row.uri]['type'] = row.range
                nodes[row.uri]['values'].append({
                    'value': None,
                    'type': row.range
                })

            if row.property == SIO.hasUnit:
                nodes[row.uri]['unit'] = row.range
                nodes[row.uri]['unitLabel'] = row.unitLabel

        options_map = {}
        units_map = defaultdict(set)

        def dfs(node):
            """Depth-first search to create valid attribute structures"""
            if 'values' in node:
                if node['type'] == OWL.Class:
                    subclasses = twks.query_rdfs_subclasses(node['uri'])
                    if not subclasses:
                        # filter owl:Class types without options
                        return
                    options_map[node['uri']] = [s.asdict() for s in subclasses]

            if 'unit' in node:
                subclasses = twks.query_rdfs_subclasses(node['unit'])
                units_map[node['unit']] = [s.asdict() for s in subclasses]

            if node['uri'] in tree:
                for child in tree[node['uri']]:
                    if child in nodes:
                        child_node = dfs(nodes[child])
                        node['attributes'].append(nodes[child])

            return node

        valid_attributes = []
        for node in nodes.values():
            t = dfs(node)
            if t:
                valid_attributes.append(t)

        return jsonify({
            'validAttributes': valid_attributes,
            'optionsMap': options_map,
            'unitsMap': units_map
        })

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

    def build_policy(source: str, id: str, label: str, definition: str, action, attributes):

        identifier = f'{source}#{id}' if source != '' else f'http://purl.org/twc/policy#{id}'

        def dfs(a: dict) -> Graphable:
            id_ = URIRef(a['@id'])
            if 'attributes' in a:
                children = [dfs(c) for c in a['attributes']]
                rest_val = BooleanClass(
                    BooleanOperation.INTERSECTION, [id_, *children])
                return AttributeRestriction(RestrictionKind.SOME_VALUES_FROM, rest_val)

            if 'values' in a and len(a['values']) == 1:
                value_, type_ = [a['values'][0][k]
                                 for k in ['@value', '@type']]

                # prov values
                if id_ == PROV.Agent:
                    return AgentRestriction(RestrictionKind.SOME_VALUES_FROM, URIRef(value_))

                if id_ == PROV.startTime:
                    return StartTimeRestriction(RestrictionKind.HAS_VALUE, Literal(value_, datatype=type_))

                if id_ == PROV.endTime:
                    return EndTimeRestriction(RestrictionKind.HAS_VALUE, Literal(value_, datatype=type_))

                rest_val_members = [id_]
                if type_ == OWL.Class:
                    rest_val_members.append(AttributeRestriction(
                        RestrictionKind.SOME_VALUES_FROM, URIRef(value_)))
                else:
                    # assumes xsd datatype from here on
                    is_maximal = twks.query_is_subclass(id_, SIO.MaximalValue)
                    is_minimal = twks.query_is_subclass(id_, SIO.MinimalValue)

                    with_rest = []

                    if is_minimal:
                        with_rest.append(
                            (XSD.minInclusive, Literal(value_, datatype=type_)))

                    if is_maximal:
                        with_rest.append(
                            (XSD.maxInclusive, Literal(value_, datatype=type_)))

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

        was_assoc_members = [dfs(a) for a in attributes]
        eq_agent = AgentRestriction(RestrictionKind.SOME_VALUES_FROM,
                                    BooleanClass(BooleanOperation.INTERSECTION,
                                                 was_assoc_members))

        eq_class = BooleanClass(BooleanOperation.INTERSECTION,
                                members=[URIRef(action), eq_agent])
        root = Class(identifier=URIRef(identifier),
                     label=label,
                     equivalent_class=eq_class,
                     subclass_of=[URIRef(action)])

        graph, _ = root.to_graph()
        return graph

    @app.route(f'{api_url}/policy', methods=['POST'])
    def create_policy():
        logging.info('Received Policy')

        data = request.json
        req = PolicyPostDTO(data)

        graph = build_policy(req.source, req.id, req.label,
                             req.definition, req.action, req.attributes)

        output = graph.serialize(format='turtle').decode('utf-8')

        logging.info(output)

        nanopublication = Nanopublication.parse_assertions(data=output,
                                                           format="ttl")
        twks.save(nanopublication)

        return {'output': output}

    return app
