from flask import Blueprint

policies_blueprint = Blueprint(
    'policies', __name__, url_prefix='/api/policies')
