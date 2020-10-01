# policy-tool-backend/app.py
import glob
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

from .models.data import Attribute
from .models.dtos import PolicyPostDTO, RequestPostDTO
from .rdf import namespaces as ns, prov
from . import config

import json

# ==============================================================================
# SETUP
# ==============================================================================

# Logging setup
LOGGER = logging.getLogger()
LOGGER.setLevel(logging.INFO)

# Create Flask app
app = Flask(__name__)

# load configuration
if os.getenv('FLASK_ENV', 'default') == 'development':
    app.config.from_object(config.DevelopmentConfig)
else:
    app.config.from_object(config.ProductionConfig)

# get config values
API_URL = app.config['API_URL']
TWKS_URL = app.config['TWKS_URL']
ONTOLOGY_PATH = app.config['ONTOLOGY_PATH']

# create TwksClient
client = TwksClient(server_base_url=TWKS_URL)


@app.route('/')
def index():
    return 'Hello there!'


@app.before_first_request
def load_ontologies():
    """
    Add ontologies into twks-server
    """
    LOGGER.info('Loading ontologies into TWKS...')
    path = os.path.join(os.path.abspath(ONTOLOGY_PATH), '*.ttl')
    files = glob.glob(path)
    max_len = max(len(f) for f in files)

    for f in files:
        file_path = os.path.abspath(os.path.join(ONTOLOGY_PATH, f))
        nanopublication = Nanopublication.parse_assertions(
            format="ttl",
            source=file_path,
            source_uri=rdflib.URIRef(pathlib.Path(file_path).as_uri()))
        client.put_nanopublication(nanopublication)
        logging.info(f'{f.ljust(max_len)} loaded into TWKS')


def get_owl_class_options(class_name: str):
    query_response = client.query_assertions(f"""
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        select ?value ?label where {{
            ?value rdfs:subClassOf+ <{class_name}> .
            ?value rdfs:label ?label
        }}
        """)
    return [{'value': str(a), 'label': str(b)}
            for (a, b) in query_response]


def get_rdf_type_options(type_name: str):
    query_response = client.query_assertions(f"""
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        select ?value ?label where {{
            ?value rdf:type <{type_name}> .
            ?value rdfs:label ?label
        }}
        """)
    return [{'value': str(a), 'label': str(b)}
            for (a, b) in query_response]


@app.route(f'{API_URL}/attributes', methods=['GET'])
def get_attributes():
    logging.info('Getting attributes')

    query_response = client.query_assertions("""
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX sio: <http://semanticscience.org/resource/>
        SELECT distinct ?attribute ?label ?property ?range ?propertyType ?extent ?cardinality WHERE {
            ?attribute rdfs:label ?label.
            ?attribute rdfs:subClassOf+ sio:Attribute.
            ?attribute (rdfs:subClassOf|owl:equivalentClass|(owl:intersectionOf/rdf:rest*/rdf:first))* ?superClass.
            {
                ?superClass owl:onProperty ?property.
                ?superClass owl:someValuesFrom|owl:allValuesFrom ?range.
                ?superClass ?extent ?range.
                optional { ?property rdf:type ?propertyType }
            } union {
                ?superClass owl:onDataRange ?range.
                ?superClass owl:onProperty ?property.
                ?superClass owl:minQualifiedCardinality|owl:maxQualifiedCardinality|owl:qualifiedCardinality ?cardinality.
                ?superClass ?extent ?cardinality.
                bind(owl:DatatypeProperty as ?propertyType)
            } union {
                ?superClass owl:onClass ?range.
                ?superClass owl:onProperty ?property.
                ?superClass owl:minQualifiedCardinality|owl:maxQualifiedCardinality|owl:qualifiedCardinality ?cardinality.
                ?superClass ?extent ?cardinality.
                bind(owl:ObjectProperty as ?propertyType)
            } union {
                ?superClass owl:onProperty ?property.
                ?superClass owl:minCardinality|owl:maxCardinality|owl:exactCardinality ?cardinality.
                ?superClass ?extent ?cardinality.
                optional { ?property rdf:type ?propertyType }
            } union {
                ?property rdfs:domain ?superClass;
                        rdfs:range ?range.
                optional { ?property rdf:type ?propertyType }
            }
        }
        """)

    node_dict = {}

    for response in query_response:
        # format the output from query into separate attribute nodes
        attr = Attribute(*response)
        if attr.uri not in node_dict:
            node_dict[attr.uri] = defaultdict(list)
            node_dict[attr.uri]['@id'] = attr.uri
            node_dict[attr.uri]['label'] = attr.label

        if attr.property == 'http://semanticscience.org/resource/hasAttribute':
            node_dict[attr.uri]['attributes'].append({'@id': attr.range})

        if attr.property in [
            'http://semanticscience.org/resource/hasValue',
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
        ]:
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
                options = get_owl_class_options(node['@id'])
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

    options_map[prov.Agent['@id']] = get_owl_class_options(prov.Agent['@id'])

    return jsonify({
        'attributes': valid_attributes,
        'options': options_map
    })

# get request attributes, including action


@app.route(f'{API_URL}/requestattributes', methods=['GET'])
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


@app.route(f'{API_URL}/actions', methods=['GET'])
def get_actions():
    logging.info('Getting actions')
    return get_rdf_type_options('http://www.w3.org/ns/prov#Activity')


@app.route(f'{API_URL}/precedences', methods=['GET'])
def get_precedences():
    logging.info('Getting precedences')
    return sorted(get_owl_class_options('http://purl.org/twc/policy/Precedence'),
                  key=itemgetter('label'))


@app.route(f'{API_URL}/effects', methods=['GET'])
def get_effects():
    logging.info('Getting effects')
    return get_rdf_type_options('http://purl.org/twc/policy/Effect')


@app.route(f'{API_URL}/obligations', methods=['GET'])
def get_obligations():
    logging.info('Getting obligations')
    return get_rdf_type_options('http://purl.org/twc/policy/Obligation')


@app.route(f'{API_URL}/conditions', methods=['GET'])
def get_conditions():
    logging.info('Getting conditions')
    return {
        'actions': get_actions(),
        'precedences': get_precedences(),
        'effects': get_effects(),
        'obligations': get_obligations()
    }


def is_subclass(uri, superClass):
    query_response = client.query_assertions(
        f"""
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        ASK {{
            <{uri}> rdfs:subClassOf+ <{superClass}>
        }}
        """)
    logging.info(str(query_response))
    return query_response


@app.route(f'{API_URL}/policy', methods=['POST'])
def create_policy():
    logging.info('Received Policy')

    data = request.json
    policy_req = PolicyPostDTO(data)

    graph = ns.assign_namespaces(Graph())

    # definition and labeling
    root = ns.POL[policy_req.id]
    graph.add((root, ns.RDF['type'], ns.OWL['class']))
    graph.add((root, ns.RDFS['label'], Literal(policy_req.label)))
    graph.add((root, ns.SKOS['definition'], Literal(policy_req.definition)))

    # conditions & effects
    graph.add((root, ns.RDFS['subClassOf'], URIRef(policy_req.action)))
    graph.add((root, ns.RDFS['subClassOf'], URIRef(policy_req.precedence)))
    for effect in policy_req.effects:
        graph.add((root, ns.RDFS['subClassOf'], URIRef(effect['@value'])))
    for obligation in policy_req.obligations:
        graph.add((root, ns.RDFS['subClassOf'], URIRef(obligation['@value'])))

    def construct_attribute_tree(attribute: dict, graph: Graph):
        base = BNode()
        children = graph.collection(BNode())
        children.append(URIRef(attribute['@id']))
        if 'attributes' in attribute:
            for child in attribute['attributes']:
                c = BNode()
                graph.add((c, ns.RDF['type'], ns.OWL['Restriction']))
                graph.add((c, ns.OWL['onProperty'], ns.SIO['hasAttribute']))
                graph.add((c, ns.OWL['someValuesFrom'],
                           construct_attribute_tree(child, graph)))
                children.append(c)

            graph.add((base, ns.RDF['type', ns.OWL['Class']]))

        elif 'values' in attribute:
            is_agent = is_subclass(attribute['@id'], ns.PROV['Agent'])
            is_maximum = is_subclass(attribute['@id'], ns.SIO['MaximalValue'])
            is_minimum = is_subclass(attribute['@id'], ns.SIO['MinimalValue'])

            for value in attribute['values']:
                v = BNode()
                graph.add((v, ns.RDF['type'], ns.OWL['Restriction']))
                if is_agent:
                    graph.add((v,
                               ns.OWL['onProperty'],
                               ns.PROV['wasAssociatedWith']))
                    graph.add((v,
                               ns.OWL['someValuesFrom'],
                               URIRef(value['@value'])))
                else:
                    _, namespace, _ = graph.namespace_manager.compute_qname(
                        value['@type'])
                    if namespace == ns.XSD:
                        graph.add((v,
                                   ns.OWL['onDatatype'],
                                   URIRef(value['@type'])))
                        restrictions = graph.collection(BNode())
                        if not is_maximum:
                            p = BNode()
                            graph.add((p,
                                       ns.XSD['minInclusive'],
                                       Literal(value['@value'],
                                               datatype=value['@type'])))
                            restrictions.append(p)
                        if not is_minimum:
                            p = BNode()
                            graph.add((p,
                                       ns.XSD['maxInclusive'],
                                       Literal(value['@value'],
                                               datatype=value['@type'])))
                            restrictions.append(p)
                        graph.add((v,
                                   ns.OWL['withRestrictions'],
                                   restrictions))

                children.append(v)

        graph.add((base, ns.OWL['intersectionOf'], children.uri))

        return base

    attr_list = graph.collection(BNode())
    for attribute in policy_req.attributes:
        attr_list.append(construct_attribute_tree(attribute, graph))

    attr_root = BNode()
    graph.add((root, ns.OWL['equivalentClass'], attr_root))
    graph.add((attr_root, ns.OWL['intersectionOf'], attr_list.uri))

    output = graph.serialize(format='turtle').decode('utf-8')

    logging.info(output)
    nanopublication = Nanopublication.parse_assertions(data=output,
                                                       format="ttl")
    client.put_nanopublication(nanopublication)
    logging.info(f'{ns.POL[policy_req.id]} loaded into TWKS')

    return {'output': output}

# create .ttl file for request


@app.route(f'{API_URL}/request', methods=['POST'])
def create_request():
    logging.info('Received Request')

    data = request.json
    request_req = RequestPostDTO(data)

    graph = ns.assign_namespaces(Graph())

    root = ns.REQ[request_req.id]
    graph.add((root, ns.RDFS['label'], Literal(request_req.label)))
    graph.add((root, ns.SKOS['definition'], Literal(request_req.definition)))

    agent_node = BNode()

    for attribute in request_req.attributes:
        is_agent = 1 if (attribute['label'] == "Agent") else 0
        is_action = 1 if (attribute['label'] == "Action") else 0
        is_affiliation = 1 if (attribute['label'] == "Affiliation") else 0
        is_starttime = 1 if (attribute['label'] == "Start time") else 0
        is_endtime = 1 if (attribute['label'] == "End time") else 0

        if is_action:
            for value in attribute['values']:
                graph.add((root, ns.RDF['type'], URIRef(value['@value'])))
        elif is_starttime:
            for value in attribute['values']:
                graph.add((root, ns.PROV['startedAtTime'], Literal(
                    value['@value'], datatype=value['@type'])))
        elif is_endtime:
            for value in attribute['values']:
                graph.add((root, ns.PROV['endedAtTime'], Literal(
                    value['@value'], datatype=value['@type'])))
        elif is_agent:
            for value in attribute['values']:
                graph.add((root, ns.PROV['wasAssociatedWith'], agent_node))
                graph.add((agent_node, ns.RDF['type'], URIRef(value['@value'])))
        else:
            if 'attributes' in attribute:
                c = BNode()
                graph.add((c, ns.RDF['type'], URIRef(attribute['@id'])))
                for attributes in attribute['attributes']:
                    for value in attributes['values']:
                        v = BNode()
                        graph.add((c, ns.SIO['hasAttribute'], v))
                        graph.add((v, ns.RDF['type'], URIRef(attributes['@id'])))
                        graph.add((v, ns.SIO['hasValue'], Literal(
                            value['@value'], datatype=value['@type'])))
                graph.add((agent_node, ns.SIO['hasAttribute'], c))
            else:
                for value in attribute['values']:
                    v = BNode()
                    graph.add((agent_node, ns.SIO['hasAttribute'], v))
                    graph.add((v, ns.RDF['type'], URIRef(attribute['@id'])))
                    if is_affiliation:
                        graph.add(
                            (v, ns.SIO['hasValue'], URIRef(value['@value'])))
                    else:
                        graph.add((v, ns.SIO['hasValue'], Literal(
                            value['@value'], datatype=value['@type'])))

    output = graph.serialize(format='turtle').decode('utf-8')

    logging.info(output)
    nanopublication = Nanopublication.parse_assertions(data=output,
                                                       format="ttl")
    client.put_nanopublication(nanopublication)
    logging.info(f'{ns.REQ[request_req.id]} loaded into TWKS')

    return {'output': output}
