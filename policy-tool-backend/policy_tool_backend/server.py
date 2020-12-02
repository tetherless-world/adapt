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
                          ValueRestriction)
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

    def build_policy(source: str,
                     id: str,
                     label: str,
                     definition: str,
                     action,
                     attributes):

        if source != None:
            identifier = URIRef(f'{source}#{id}')
        else:
            identifier = URIRef(POL[id])

        eq_class = BooleanClass(operation=BooleanOperation.INTERSECTION,
                                members=[URIRef(action)])

        def dfs(a: dict) -> Graphable:
            if 'attributes' in a:
                children = [dfs(c) for c in a['attributes']]
                rest_val = BooleanClass(BooleanOperation.INTERSECTION, [
                                        URIRef(a['@id']), *children])
                return AttributeRestriction(RestrictionKind.SOME_VALUES_FROM, rest_val)

            if 'values' in a and len(a['values']) == 1:
                v = a['values'][0]
                if a['@id'] == 'http://www.w3.org/ns/prov#Agent':
                    return AgentRestriction(RestrictionKind.SOME_VALUES_FROM,
                                            URIRef(v['@value']))

                rest_val_members = [URIRef(a['@id'])]
                if v['@type'] == OWL.Class:
                    rest_val_members.append(AttributeRestriction(RestrictionKind.SOME_VALUES_FROM,
                                                                 URIRef(v['@value'])))
                else:
                    # assumes xsd datatype from here on
                    is_maximal = twks.query_is_subclass(
                        a['@id'], SIO.MaximalValue)
                    is_minimal = twks.query_is_subclass(
                        a['@id'], SIO.MinimalValue)

                    if not is_maximal and not is_minimal:
                        rest_val_members.append(ValueRestriction(RestrictionKind.HAS_VALUE,
                                                                 Literal(v['@value'], datatype=v['@type'])))

                    if is_maximal:
                        with_rest = [(XSD.maxInclusive, Literal(v['@value'],
                                                                datatype=v['@type']))]

                    if is_minimal:
                        with_rest = [(XSD.minInclusive, Literal(v['@value'],
                                                                datatype=v['@type']))]

                    rest_val_members.append(ValueRestriction(RestrictionKind.SOME_VALUES_FROM,
                                                             RestrictedDatatype(v['@type'], with_rest)))

                return AttributeRestriction(RestrictionKind.SOME_VALUES_FROM,
                                            BooleanClass(BooleanOperation.INTERSECTION, rest_val_members))
            else:
                raise RuntimeError('Invalid attribute structure.')

        for a in attributes:
            eq_class.members.append(dfs(a))

        root = Class(identifier=identifier,
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

        # nanopublication = Nanopublication.parse_assertions(data=output,
        #                                                    format="ttl")
        # client.put_nanopublication(nanopublication)

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


# # Create Flask app
# app = Flask(__name__)

# # load configuration
# if os.getenv('FLASK_ENV', 'default') == 'development':
#     app.config.from_object(config.DevelopmentConfig)
# else:
#     app.config.from_object(config.ProductionConfig)

# # get config values
# API_URL = app.config['API_URL']
# TWKS_URL = app.config['TWKS_URL']
# ONTOLOGY_PATH = app.config['ONTOLOGY_PATH']

# # create TwksClient
# client = TwksClient(server_base_url=TWKS_URL)


# @app.route('/')
# def index():
#     return 'Hello there!'


# @app.before_first_request
# def load_ontologies():
#     """
#     Add ontologies into twks-server
#     """
#     LOGGER.info('Loading ontologies into TWKS...')
#     path = os.path.join(os.path.abspath(ONTOLOGY_PATH), '*.ttl')
#     files = glob.glob(path)
#     max_len = max(len(f) for f in files)

#     for f in files:
#         file_path = os.path.abspath(os.path.join(ONTOLOGY_PATH, f))
#         nanopublication = Nanopublication.parse_assertions(
#             format="ttl",
#             source=file_path,
#             source_uri=rdflib.URIRef(pathlib.Path(file_path).as_uri()))
#         client.put_nanopublication(nanopublication)
#         logging.info(f'{f.ljust(max_len)} loaded into TWKS')


# def get_owl_class_options(class_name: str):
#     query_response = client.query_assertions(f"""
#         PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
#         select ?value ?label where {{
#             ?value rdfs:subClassOf+ <{class_name}> .
#             ?value rdfs:label ?label
#         }}
#         """)
#     return [{'value': str(a), 'label': str(b)}
#             for (a, b) in query_response]


# def get_rdf_type_options(type_name: str):
#     query_response = client.query_assertions(f"""
#         PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
#         PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
#         select ?value ?label where {{
#             ?value rdf:type <{type_name}> .
#             ?value rdfs:label ?label
#         }}
#         """)
#     return [{'value': str(a), 'label': str(b)}
#             for (a, b) in query_response]


# @app.route(f'{API_URL}/attributes', methods=['GET'])
# def get_attributes():
#     logging.info('Getting attributes')

#     query_response = client.query_assertions("""
#         PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
#         PREFIX owl: <http://www.w3.org/2002/07/owl#>
#         PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
#         PREFIX sio: <http://semanticscience.org/resource/>
#         SELECT distinct ?attribute ?label ?property ?range ?propertyType ?extent ?cardinality WHERE {
#             ?attribute rdfs:label ?label.
#             ?attribute rdfs:subClassOf+ sio:Attribute.
#             ?attribute (rdfs:subClassOf|owl:equivalentClass|(owl:intersectionOf/rdf:rest*/rdf:first))* ?superClass.
#             {
#                 ?superClass owl:onProperty ?property.
#                 ?superClass owl:someValuesFrom|owl:allValuesFrom ?range.
#                 ?superClass ?extent ?range.
#                 optional { ?property rdf:type ?propertyType }
#             } union {
#                 ?superClass owl:onDataRange ?range.
#                 ?superClass owl:onProperty ?property.
#                 ?superClass owl:minQualifiedCardinality|owl:maxQualifiedCardinality|owl:qualifiedCardinality ?cardinality.
#                 ?superClass ?extent ?cardinality.
#                 bind(owl:DatatypeProperty as ?propertyType)
#             } union {
#                 ?superClass owl:onClass ?range.
#                 ?superClass owl:onProperty ?property.
#                 ?superClass owl:minQualifiedCardinality|owl:maxQualifiedCardinality|owl:qualifiedCardinality ?cardinality.
#                 ?superClass ?extent ?cardinality.
#                 bind(owl:ObjectProperty as ?propertyType)
#             } union {
#                 ?superClass owl:onProperty ?property.
#                 ?superClass owl:minCardinality|owl:maxCardinality|owl:exactCardinality ?cardinality.
#                 ?superClass ?extent ?cardinality.
#                 optional { ?property rdf:type ?propertyType }
#             } union {
#                 ?property rdfs:domain ?superClass;
#                         rdfs:range ?range.
#                 optional { ?property rdf:type ?propertyType }
#             }
#         }
#         """)

#     node_dict = {}

#     for response in query_response:
#         # format the output from query into separate attribute nodes
#         attr = Attribute(*response)
#         if attr.uri not in node_dict:
#             node_dict[attr.uri] = defaultdict(list)
#             node_dict[attr.uri]['@id'] = attr.uri
#             node_dict[attr.uri]['label'] = attr.label

#         if attr.property == 'http://semanticscience.org/resource/hasAttribute':
#             node_dict[attr.uri]['attributes'].append({'@id': attr.range})

#         if attr.property in [
#             'http://semanticscience.org/resource/hasValue',
#             'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
#         ]:
#             node_dict[attr.uri]['values'].append({
#                 '@type': attr.range,
#                 '@value': None
#             })

#     # construct a list of valid attributes and option-map
#     # for class-like attributes
#     valid_attributes = []
#     options_map = {}

#     def dfs(node):
#         # dfs for constructing the attribute tree
#         if 'values' in node:
#             if node['values'][0]['@type'] == 'http://www.w3.org/2002/07/owl#Class':
#                 options = get_owl_class_options(node['@id'])
#                 if not options:
#                     # filter owl:Class types without options
#                     return
#                 options_map[node['@id']] = options

#         elif 'attributes' in node:
#             node['attributes'] = [dfs(node_dict[n['@id']])
#                                   for n in node['attributes']
#                                   if n['@id'] in node_dict]
#         return node

#     for node in node_dict.values():
#         attribute = {}
#         tree = dfs(node)
#         if tree:
#             attribute['@id'] = tree['@id']
#             attribute['label'] = tree['label']
#             attribute['default'] = tree
#             valid_attributes.append(attribute)

#     # append prov attributes
#     for attr in [prov.startTime, prov.endTime, prov.Agent]:
#         valid_attributes.append(attr)

#     options_map[prov.Agent['@id']] = get_owl_class_options(prov.Agent['@id'])

#     return jsonify({
#         'attributes': valid_attributes,
#         'options': options_map
#     })

# # get request attributes, including action


# @app.route(f'{API_URL}/requestattributes', methods=['GET'])
# def get_request_attributes():
#     logging.info('Getting request attributes')

#     attributes = get_attributes()

#     response_data = json.loads(attributes.get_data())

#     response_data['attributes'].append(prov.Action)
#     response_data['options'][prov.Action['@id']] = get_actions()

#     return jsonify({
#         'attributes': response_data['attributes'],
#         'options': response_data['options']
#     })


# @app.route(f'{API_URL}/actions', methods=['GET'])
# def get_actions():
#     logging.info('Getting actions')
#     return get_rdf_type_options('http://www.w3.org/ns/prov#Activity')


# @app.route(f'{API_URL}/precedences', methods=['GET'])
# def get_precedences():
#     logging.info('Getting precedences')
#     return sorted(get_owl_class_options('http://purl.org/twc/policy/Precedence'),
#                   key=itemgetter('label'))


# @app.route(f'{API_URL}/effects', methods=['GET'])
# def get_effects():
#     logging.info('Getting effects')
#     return get_rdf_type_options('http://purl.org/twc/policy/Effect')


# @app.route(f'{API_URL}/obligations', methods=['GET'])
# def get_obligations():
#     logging.info('Getting obligations')
#     return get_rdf_type_options('http://purl.org/twc/policy/Obligation')


# @app.route(f'{API_URL}/conditions', methods=['GET'])
# def get_conditions():
#     logging.info('Getting conditions')
#     return {
#         'actions': get_actions(),
#         'precedences': get_precedences(),
#         'effects': get_effects(),
#         'obligations': get_obligations()
#     }


# def is_subclass(uri, superClass):
#     query_response = client.query_assertions(
#         f"""
#         PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
#         ASK {{
#             <{uri}> rdfs:subClassOf+ <{superClass}>
#         }}
#         """)
#     logging.info(str(query_response))
#     return query_response


# def build_policy(source: str,
#                  id: str,
#                  label: str,
#                  definition: str,
#                  action,
#                  attributes):

#     if source != None:
#         identifier = URIRef(f'{source}#{id}')
#     else:
#         identifier = URIRef(POL[id])

#     eq_class = BooleanClass(operation=BooleanOperation.INTERSECTION,
#                             members=[URIRef(action)])

#     def dfs(a: dict) -> Graphable:
#         if 'attributes' in a:
#             children = [dfs(c) for c in a['attributes']]
#             rest_val = BooleanClass(BooleanOperation.INTERSECTION,
#                                     [URIRef(a['@id']), *children])
#             return AttributeRestriction(RestrictionKind.SOME_VALUES_FROM,
#                                         rest_val)
#         elif 'values' in a and len(a['values']) == 1:
#             v = a['values'][0]
#             if a['@id'] == 'http://www.w3.org/ns/prov#Agent':
#                 return AgentRestriction(RestrictionKind.SOME_VALUES_FROM,
#                                         URIRef(v['@value']))
#             elif v['@type'] == OWL.Class:
#                 return AttributeRestriction(RestrictionKind.SOME_VALUES_FROM,
#                                             URIRef(v['@value']))
#             else:
#                 # assumes xsd datatype from here on
#                 with_rest = []
#                 if not is_subclass(a['@id'], SIO.MaximalValue):
#                     with_rest.append((XSD.minInclusive,
#                                       Literal(v['@value'], datatype=v['@type'])))
#                 if not is_subclass(a['@id'], SIO.MinimalValue):
#                     with_rest.append((XSD.maxInclusive,
#                                       Literal(v['@value'], datatype=v['@type'])))

#                 rest_val = RestrictedDatatype(on_datatype=v['@type'],
#                                               with_restrictions=with_rest)
#                 return ValueRestriction(RestrictionKind.SOME_VALUES_FROM,
#                                         rest_val)
#         else:
#             raise RuntimeError('Invalid attribute structure.')

#     for a in attributes:
#         eq_class.members.append(dfs(a))

#     root = Class(identifier=identifier,
#                  label=label,
#                  equivalent_class=eq_class,
#                  subclass_of=[URIRef(action)])

#     graph, _ = root.to_graph()
#     return graph


# @app.route(f'{API_URL}/policy', methods=['POST'])
# def create_policy():
#     logging.info('Received Policy')

#     data = request.json
#     req = PolicyPostDTO(data)

#     graph = build_policy(req.source, req.id, req.label,
#                          req.definition, req.action, req.attributes)

#     output = graph.serialize(format='turtle').decode('utf-8')

#     logging.info(output)
#     # nanopublication = Nanopublication.parse_assertions(data=output,
#     #                                                    format="ttl")
#     # client.put_nanopublication(nanopublication)
#     # logging.info(f'{POL[policy_req.id]} loaded into TWKS')

#     return {'output': output}

# # create .ttl file for request


# @app.route(f'{API_URL}/request', methods=['POST'])
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
#                                                        format="ttl")
#     client.put_nanopublication(nanopublication)
#     logging.info(f'{REQ[request_req.id]} loaded into TWKS')

#     return {'output': output}
