from flask import Blueprint

obligations_blueprint = Blueprint('obligations',
                                  __name__,
                                  url_prefix='/api/obligations')
