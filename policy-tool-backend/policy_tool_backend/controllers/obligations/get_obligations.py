from flask import jsonify

from ...rdf.common.namespaces import POL
from ..common.queries import get_uris_by_type
from .obligations_blueprint import obligations_blueprint


@obligations_blueprint.route('/')
def get_obligations():
    results = get_uris_by_type(POL.Obligation)
    obligations = [{'value': row.uri, 'label': row.label} for row in results]
    response = {'validObligations': obligations}
    return jsonify(response)
