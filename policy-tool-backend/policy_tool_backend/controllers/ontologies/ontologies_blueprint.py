from flask import Blueprint
ontologies_blueprint = Blueprint(
    'ontologies', __name__, url_prefix='/api/ontologies')
