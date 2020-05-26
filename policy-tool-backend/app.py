# policy-tool-backend/app.py
import glob
import logging
import os
import pathlib
from operator import itemgetter
from collections import defaultdict

import rdflib
from flask import Flask, jsonify
from twks.client import TwksClient
from twks.nanopub import Nanopublication

import prov
from classes.Attribute import Attribute

# from attribute_helper import (get_numerical_restrictions, is_numerical)

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
