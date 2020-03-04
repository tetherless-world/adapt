# policy-tool-backend/app.py
from flask import Flask, render_template
import logging
import os
import pathlib
import re

import rdflib
from flask import Flask, request, jsonify
from twks.client import TwksClient
from twks.nanopub import Nanopublication

# Logging setup
logging.basicConfig(level=logging.INFO)


# Configurations
configs = {
    'development': 'config.DevelopmentConfig',
    'production': 'config.ProductionConfig',
    'default': 'config.ProductionConfig'
}


def configure_app(app):
    config_name = os.getenv('FLASK_ENV', 'default')
    app.config.from_object(configs[config_name])


app = Flask(__name__)
configure_app(app)

# load config values
API_URL = app.config['API_URL']
TWKS_URL = app.config['TWKS_URL']
ONTOLOGY_PATH = app.config['ONTOLOGY_PATH']

# initialize twks-client
client = TwksClient(server_base_url=TWKS_URL)


@app.before_first_request
def __load_ontologies():
    """
    Add ontologies to the twks-server
    """
    logging.info('LOADING ONTOLOGIES')
    files = os.listdir(os.path.abspath(ONTOLOGY_PATH))
    max_path_len = max(len(f) for f in files)
    for f in files:
        file_path = os.path.abspath(os.path.join(ONTOLOGY_PATH, f))
        nanopublication = Nanopublication.parse_assertions(
            format="ttl",
            source=file_path,
            source_uri=rdflib.URIRef(pathlib.Path(file_path).as_uri()))
        logging.info(f"[LOAD] {f.ljust(max_path_len)}")
        client.put_nanopublication(nanopublication)


@app.route('/')
def index():
    return 'Hello there!'


@app.route(f'{API_URL}/domains', methods=['GET'])
def getDomains():
    response = client.query_assertions(
        """
        PREFIX  owl:    <http://www.w3.org/2002/07/owl#>
        PREFIX  rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT  ?ont
        WHERE   { ?ont rdf:type owl:Ontology }
        """)

    # assemble domains
    # domains = []
    # for r in response:
    #     uri = str(r[0])
    #     if re.search('/policy/(\w*/)*policy/?$', uri):
    #         title = uri[:(-8 if uri[-1] == '/' else -7)].split('/')[-1].upper()
    #         domains.append({'uri': uri, 'title': title})

    logging.info('Returning domains')
    # return jsonify(domains)
    return jsonify([r for (r,) in response])


@app.route(f'{API_URL}/attributes', methods=['GET'])
def getAttributes():
    logging.info('GETTING ATTRIBUTES')
    response = client.query_assertions(
        """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX sio: <http://semanticscience.org/resource/>
        SELECT distinct ?attribute ?property ?range ?propertyType ?extent ?cardinality WHERE {
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

    attributes = {}
    for attribute in response:
        a_name, a_prop, a_range, a_propType, a_extent, a_card = attribute
        logging.info(f'[GET] {a_name}')
        # logging.info(a_name)
        # logging.info(a_prop)
        # logging.info(a_range)
        # logging.info(a_propType)
        # logging.info(a_extent)
        # logging.info(a_card)
        if a_name not in attributes:
            attributes[a_name] = {}
        attributes[a_name][a_prop] = a_range

    return jsonify(attributes)


@app.route(f'{API_URL}/policies', methods=['POST'])
def constructPolicy(policy):
    pass
