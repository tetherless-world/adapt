from flask import Blueprint

precedences_blueprint = Blueprint(
    'precedences', __name__, url_prefix='/api/precedences')
