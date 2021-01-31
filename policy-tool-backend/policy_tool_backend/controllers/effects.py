from flask import Blueprint, jsonify

from ..rdf.common.namespaces import POL
from .common.queries import get_uri_by_type

effects_api = Blueprint('effects', __name__, url_prefix='/api/effects')


@effects_api.route('/')
def get_effects():
    results = get_uri_by_type(POL.Effect)
    valid_effects = [{'value': row.uri, 'label': row.label} for row in results]
    response = {'validEffects': valid_effects}
    return jsonify(response)
