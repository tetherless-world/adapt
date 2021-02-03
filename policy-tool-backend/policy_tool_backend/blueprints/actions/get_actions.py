from flask import jsonify
from rdflib import PROV

from ...common.queries import get_uris_by_type
from ...common.utils import to_option_list
from .actions_blueprint import actions_blueprint


@actions_blueprint.route('')
def get_actions():
    results = get_uris_by_type(PROV.Activity)
    actions = to_option_list(results)
    response = {'validActions': actions}
    return jsonify(response)
