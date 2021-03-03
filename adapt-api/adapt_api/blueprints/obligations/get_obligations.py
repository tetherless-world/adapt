from flask import jsonify

from ...common import POL
from ...common.queries import select_uris_by_type
from ...common.utils import to_option_list
from .obligations_blueprint import obligations_blueprint


@obligations_blueprint.route('')
def get_obligations():
    results = select_uris_by_type(POL.Obligation)
    obligations = to_option_list(results)
    response = {'validObligations': obligations}
    return jsonify(response)
