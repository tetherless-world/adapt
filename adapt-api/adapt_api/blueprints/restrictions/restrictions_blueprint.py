from flask import Blueprint

restrictions_blueprint = Blueprint(
    'restrictions', __name__, url_prefix='/api/restrictions')
