# policy-tool-backend/app.py

import logging
from os import listdir
from os.path import join, dirname
import pathlib

import rdflib
from flask import Flask, request, jsonify
from twks.client import TwksClient
from twks.nanopub import Nanopublication

client = TwksClient(server_base_url='http://localhost:8080')
api_url = '/api'

app = Flask(__name__)


@app.before_first_request
def __load_ontologies():
    """
    Add ontologies to the twks-server
    """
    files = [
        'ontologies/policy.ttl',
        'ontologies/healthcare.ttl',
        'ontologies/healthcare-policy.ttl',
        'ontologies/dsa.ttl',
        'ontologies/dsa-policy.ttl'
    ]
    print('hello')
    for file_name in files:
        logging.info(f"putting {file_name} nanopublication to the server")
        file_path = join(dirname(__file__), file_name)
        nanopublication = Nanopublication.parse_assertions(
            format="ttl",
            source=file_path,
            source_uri=rdflib.URIRef(pathlib.Path(file_path).as_uri()))
        client.put_nanopublication(nanopublication)


@app.route('/')
def index():
    return 'Hello there!'


@app.route(f'{api_url}/domains', methods=['GET'])
def getDomains():
    return jsonify([node for node in client.get_assertions().all_nodes()])


@app.route(f'{api_url}/policies', methods=['POST'])
def constructPolicy(policy):
    pass
