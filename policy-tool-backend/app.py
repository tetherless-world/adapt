# policy-tool-backend/app.py
import json
import logging
import os
import pathlib
import re

import rdflib
from flask import Flask, jsonify, render_template, request
from twks.client import TwksClient
from twks.nanopub import Nanopublication

from src.controllers import attributes, domains, conditions

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

# Build blueprints
blueprints = [
    attributes.AttributeControllerBP.build(client, f'{API_URL}/attributes'),
    domains.DomainControllerBP.build(client, f'{API_URL}/domains'),
    conditions.ConditionControllerBP.build(client, f'{API_URL}/conditions')
]

for bp in blueprints:
    app.register_blueprint(bp)


@app.route('/')
def index():
    return 'Hello there!'


@app.before_first_request
def load_ontologies():
    """
    Add ontologies to the twks-server
    """
    LOGGER.info('LOADING ONTOLOGIES')
    files = os.listdir(os.path.abspath(ONTOLOGY_PATH))
    max_path_len = max(len(f) for f in files)
    for f in files:
        file_path = os.path.abspath(os.path.join(ONTOLOGY_PATH, f))
        nanopublication = Nanopublication.parse_assertions(
            format="ttl",
            source=file_path,
            source_uri=rdflib.URIRef(pathlib.Path(file_path).as_uri()))
        client.put_nanopublication(nanopublication)
        logging.info(f"[LOAD] {f.ljust(max_path_len)}")


@app.after_request
def response_handling(response):
    if CONFIG_NAME == 'development':
        response.headers['Access-Control-Allow-Origin'] = '*'

    return response
