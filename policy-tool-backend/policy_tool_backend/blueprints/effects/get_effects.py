from flask import jsonify

from ...common import POL
from ...common.queries import get_uris_by_type
from ...common.utils import to_option_list
from .effects_blueprint import effects_blueprint


@effects_blueprint.route('')
def get_effects():
    results = get_uris_by_type(POL.Effect)
    effects = to_option_list(results)
    response = {'validEffects': effects}
    return jsonify(response)
