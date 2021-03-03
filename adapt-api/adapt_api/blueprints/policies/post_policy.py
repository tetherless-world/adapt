import json
from operator import itemgetter
from typing import List

from flask import current_app, jsonify, request
from rdflib import Graph, plugin
from rdflib.serializer import Serializer
from twks.nanopub import Nanopublication

from ...common import graph_factory
from .policies_blueprint import policies_blueprint


@policies_blueprint.route('', methods=['POST'])
def post_policy():
    data = request.json
    current_app.logger.info(json.dumps(data))
    result = graph_factory().parse(data=json.dumps(
        data), format='json-ld').serialize(format='ttl').decode('utf-8')
    current_app.logger.info(result)
    pub = Nanopublication.parse_assertions(data=result, format="turtle")
    current_app.store.put_nanopublication(pub)
    return data['@id']
