# policy-tool-backend/app.py

import logging
import os
import pathlib

import rdflib
# from rdflib.plugins.sparql.results.xmlresults import XMLResultParser
from flask import Flask, request, jsonify
from twks.client import TwksClient
from twks.nanopub import Nanopublication


# Configurations
API_URL = '/api'
ONTOLOGY_PATH = os.path.abspath('../ontologies')

client = TwksClient(server_base_url='http://localhost:8080')
# xml_result_parser = XMLResultParser()

app = Flask(__name__)


@app.before_first_request
def __load_ontologies():
    """
    Add ontologies to the twks-server
    """
    for f in os.listdir(ONTOLOGY_PATH):
        file_path = os.path.abspath(os.path.join('../ontologies', f))
        nanopublication = Nanopublication.parse_assertions(
            format="ttl",
            source=file_path,
            source_uri=rdflib.URIRef(pathlib.Path(file_path).as_uri()))
        logging.info(f"putting {f} nanopublication to the server")
        client.put_nanopublication(nanopublication)


@app.route('/')
def index():
    return 'Hello there!'


@app.route(f'{API_URL}/domains', methods=['GET'])
def getDomains():
    results = client.query_assertions(
        """
        PREFIX  owl:    <http://www.w3.org/2002/07/owl#>
        PREFIX  rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT  ?ont    WHERE   { ?ont  rdf:type    <http://www.w3.org/2002/07/owl#Ontology> }
        """)
    logging.info('Returning domains')
    return jsonify([result for result in results])


@app.route(f'{API_URL}/policies', methods=['POST'])
def constructPolicy(policy):
    pass
