from .actions import actions_blueprint
from .effects import effects_blueprint
from .obligations import obligations_blueprint
from .ontologies import ontologies_blueprint
from .policies import policies_blueprint
from .precedences import precedences_blueprint
from .restrictions import restrictions_blueprint

blueprint_list = [
    actions_blueprint,
    effects_blueprint,
    obligations_blueprint,
    ontologies_blueprint,
    policies_blueprint,
    precedences_blueprint,
    restrictions_blueprint
]
