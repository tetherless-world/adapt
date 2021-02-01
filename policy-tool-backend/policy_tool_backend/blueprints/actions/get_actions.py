from flask import jsonify
from rdflib import PROV

from ...common.queries import get_uris_by_type
from .actions_blueprint import actions_blueprint


@actions_blueprint.route('')
def get_actions():
    results = get_uris_by_type(PROV.Activity)
    actions = [{'value': row.uri, 'label': row.label} for row in results]
    response = {'validActions': actions}
    return jsonify(response)
