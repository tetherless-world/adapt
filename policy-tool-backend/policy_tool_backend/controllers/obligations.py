from flask import Blueprint, current_app, jsonify

from ..rdf.common.namespaces import POL
from .common.queries import get_uri_by_type

obligations_api = Blueprint('obligations', __name__, url_prefix='/api/obligations')


@obligations_api.route('/')
def get_effects():
    results = get_uri_by_type(POL.Obligation)
    valid_obligations = [{'value': row.uri, 'label': row.label}
                         for row in results]
    response = {'validObligations': valid_obligations}
    return jsonify(response)
