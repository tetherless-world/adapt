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

import prov
from classes.Attribute import Attribute
from classes.PolicyPostDTO import PolicyPostDTO
from classes.RequestPostDTO import RequestPostDTO
from namespaces import (DSA_POL, DSA_T, HEALTH_POL, HEALTH_T, OWL, POL, REQ, PROV,
                        PROV_O, RDF, RDFS, SIO, SKOS, XSD, assign_namespaces)

import json

# Logging setup
LOGGER = logging.getLogger()
LOGGER.setLevel(logging.INFO)

# ==============================================================================
# SETUP
# ==============================================================================

CONFIG_MAP = {
    'development': 'config.DevelopmentConfig',
    'production': 'config.ProductionConfig',
    'default': 'config.ProductionConfig'
}
CONFIG_NAME = os.getenv('FLASK_ENV', 'default')


# Create Flask app
app = Flask(__name__)

# load configuration
app.config.from_object(CONFIG_MAP[CONFIG_NAME])

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

    graph = assign_namespaces(Graph())

    # definition and labeling
    root = POL[policy_req.id]
    graph.add((root, RDF['type'], OWL['class']))
    graph.add((root, RDFS['label'], Literal(policy_req.label)))
    graph.add((root, SKOS['definition'], Literal(policy_req.definition)))

    # conditions & effects
    graph.add((root, RDFS['subClassOf'], URIRef(policy_req.action)))
    graph.add((root, RDFS['subClassOf'], URIRef(policy_req.precedence)))
    for effect in policy_req.effects:
        graph.add((root, RDFS['subClassOf'], URIRef(effect['@value'])))
    for obligation in policy_req.obligations:
        graph.add((root, RDFS['subClassOf'], URIRef(obligation['@value'])))

    def construct_attribute_tree(attribute: dict, graph: Graph):
        base = BNode()
        children = graph.collection(BNode())
        children.append(URIRef(attribute['@id']))
        if 'attributes' in attribute:
            for child in attribute['attributes']:
                c = BNode()
                graph.add((c, RDF['type'], OWL['Restriction']))
                graph.add((c, OWL['onProperty'], SIO['hasAttribute']))
                graph.add((c, OWL['someValuesFrom'],
                           construct_attribute_tree(child, graph)))
                children.append(c)

            graph.add((base, RDF['type', OWL['Class']]))

        elif 'values' in attribute:
            is_agent = is_subclass(attribute['@id'], PROV['Agent'])
            is_maximum = is_subclass(attribute['@id'], SIO['MaximalValue'])
            is_minimum = is_subclass(attribute['@id'], SIO['MinimalValue'])

            for value in attribute['values']:
                v = BNode()
                graph.add((v, RDF['type'], OWL['Restriction']))
                if is_agent:
                    graph.add((v,
                               OWL['onProperty'],
                               PROV['wasAssociatedWith']))
                    graph.add((v,
                               OWL['someValuesFrom'],
                               URIRef(value['@value'])))
                else:
                    _, namespace, _ = graph.namespace_manager.compute_qname(
                        value['@type'])
                    if namespace == XSD:
                        graph.add((v,
                                   OWL['onDatatype'],
                                   URIRef(value['@type'])))
                        restrictions = graph.collection(BNode())
                        if not is_maximum:
                            p = BNode()
                            graph.add((p,
                                       XSD['minInclusive'],
                                       Literal(value['@value'],
                                               datatype=value['@type'])))
                            restrictions.append(p)
                        if not is_minimum:
                            p = BNode()
                            graph.add((p,
                                       XSD['maxInclusive'],
                                       Literal(value['@value'],
                                               datatype=value['@type'])))
                            restrictions.append(p)
                        graph.add((v,
                                   OWL['withRestrictions'],
                                   restrictions))

                children.append(v)

        graph.add((base, OWL['intersectionOf'], children.uri))

        return base

    attr_list = graph.collection(BNode())
    for attribute in policy_req.attributes:
        attr_list.append(construct_attribute_tree(attribute, graph))

    attr_root = BNode()
    graph.add((root, OWL['equivalentClass'], attr_root))
    graph.add((attr_root, OWL['intersectionOf'], attr_list.uri))

    output = graph.serialize(format='turtle').decode('utf-8')

    logging.info(output)
    nanopublication = Nanopublication.parse_assertions(data=output,
                                                       format="ttl")
    client.put_nanopublication(nanopublication)
    logging.info(f'{POL[policy_req.id]} loaded into TWKS')

    return {'output': output}

@app.route(f'{API_URL}/request', methods=['POST'])
def create_request():
    logging.info('Received Request')

    data = request.json
    request_req = RequestPostDTO(data)

    graph = assign_namespaces(Graph())

    # definition and labeling
    root = REQ[request_req.id]
    graph.add((root, RDF['type'], OWL['class']))
    graph.add((root, RDFS['label'], Literal(request_req.label)))
    graph.add((root, SKOS['definition'], Literal(request_req.definition)))


    def construct_attribute_tree(attribute: dict, graph: Graph):

        base = BNode()
        children = graph.collection(BNode())
        children.append(URIRef(attribute['@id']))
        if 'attributes' in attribute:
            for child in attribute['attributes']:
                c = BNode()
                graph.add((c, RDF['type'], OWL['Restriction']))
                graph.add((c, OWL['onProperty'], SIO['hasAttribute']))
                graph.add((c, OWL['someValuesFrom'],
                           construct_attribute_tree(child, graph)))
                children.append(c)

            graph.add((base, OWL['intersectionOf'], children.uri))

            return base

        else:

            is_agent = 1 if (attribute['label']=="Agent") else 0
            is_action = 1 if (attribute['label']=="Action") else 0
            is_affiliation = 1 if (attribute['label']=="Affiliation") else 0
            is_maximum = 1 if (attribute['label']=="Frequency maximum" or attribute['label']=="End time") else 0
            is_minimum = 1 if (attribute['label']=="Frequency minimum" or attribute['label']=="Start time") else 0

            for value in attribute['values']:
                v = BNode()
                graph.add((v, RDF['type'], OWL['Restriction']))
                
                if is_agent or is_action or is_affiliation:
                
                    graph.add((v,
                               OWL['onProperty'],
                               PROV['wasAssociatedWith']))
                    graph.add((v,
                               OWL['someValuesFrom'],
                               URIRef(value['@value'])))
                else:
                    _, namespace, _ = graph.namespace_manager.compute_qname(
                        value['@type'])

                    if str(namespace)==str(XSD):

                        graph.add((v,
                                   OWL['onDatatype'],
                                   URIRef(value['@type'])))
                        restrictions = graph.collection(BNode())
                        
                        if is_maximum:
                            p = BNode()
                            graph.add((p,
                                       XSD['maxInclusive'],
                                       Literal(value['@value'],
                                               datatype=value['@type'])))
                            restrictions.append(p)
                        elif is_minimum:
                            p = BNode()
                            graph.add((p,
                                       XSD['minInclusive'],
                                       Literal(value['@value'],
                                               datatype=value['@type'])))
                            restrictions.append(p)
                        else:
                            p = BNode()
                            graph.add((p,
                                       XSD['enumeration'],
                                       Literal(value['@value'],
                                               datatype=value['@type'])))
                            restrictions.append(p)

                        for r in restrictions:
                            graph.add((v,
                                       OWL['withRestrictions'],
                                       r))
                children.append(v)

        graph.add((base, OWL['intersectionOf'], children.uri))

        return base

    attr_list = graph.collection(BNode())
    for attribute in request_req.attributes:
        attr_list.append(construct_attribute_tree(attribute, graph)) 

    attr_root = BNode()
    graph.add((root, OWL['equivalentClass'], attr_root))
    graph.add((attr_root, OWL['intersectionOf'], attr_list.uri))

    output = graph.serialize(format='turtle').decode('utf-8')

    logging.info(output)
    nanopublication = Nanopublication.parse_assertions(data=output,
                                                       format="ttl")
    client.put_nanopublication(nanopublication)
    logging.info(f'{REQ[request_req.id]} loaded into TWKS')

    return {'output': output}