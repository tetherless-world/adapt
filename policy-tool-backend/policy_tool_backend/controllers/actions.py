from flask import Blueprint, jsonify
from rdflib.namespace import PROV

from .common.queries import get_uri_by_type

actions_api = Blueprint('actions', __name__, url_prefix='/api/actions')


@actions_api.route('/')
def get_actions():
    results = get_uri_by_type(PROV.Activity)
    valid_actions = [{'value': row.uri, 'label': row.label} for row in results]
    response = {'validActions': valid_actions}
    return jsonify(response)
