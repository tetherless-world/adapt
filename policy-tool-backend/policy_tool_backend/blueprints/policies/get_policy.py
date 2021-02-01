import json

from flask import jsonify, request

from ...common import graph_factory
from .policies_blueprint import policies_blueprint
from .queries import get_policy_by_uri


@policies_blueprint.route('/')
def get_policy():
    uri = request.args.get('uri')
    fmt = request.args.get('format', 'turtle')

    result = get_policy_by_uri(uri)

    graph = graph_factory()
    for triple in result:
        graph.add(triple)

    if fmt == 'json-ld':
        policy = json.loads(
            graph.serialize(format='json-ld',
                            context={
                                "owl": "http://www.w3.org/2002/07/owl#",
                                "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                                "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
                                "sio": "http://semanticscience.org/resource/",
                                "xsd": "http://www.w3.org/2001/XMLSchema#"
                            }).decode('utf-8'))
        return jsonify(policy)

    policy = graph.serialize(format=fmt).decode('utf-8')
    return policy
