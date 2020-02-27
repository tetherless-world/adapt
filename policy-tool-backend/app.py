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


# Configurations
API_URL = '/api'
ONTOLOGY_PATH = os.path.abspath('../ontologies')


# Configurations
API_URL = '/api'
ONTOLOGY_PATH = os.path.abspath('../ontologies')

client = TwksClient(server_base_url='http://localhost:8080')

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
