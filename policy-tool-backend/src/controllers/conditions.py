import logging

from flask import Blueprint, current_app, jsonify
from twks.client import TwksClient

from .common.ClientControllerBlueprint import ClientControllerBlueprint
from ..models.conditions.Condition import Condition

# configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class ConditionControllerBP(ClientControllerBlueprint):

    @staticmethod
    def build(client, url_prefix):
        controller = Blueprint('condition_controller',
                               __name__,
                               url_prefix=url_prefix)

        def _get_actions():
            response = client.query_assertions(
                """
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
                PREFIX prov: <http://www.w3.org/ns/prov#>
                SELECT ?action ?label WHERE {
                    ?action rdf:type prov:Activity.
                    ?action rdfs:label ?label.
                }
                """
            )
            return [Condition(*r) for r in response]

        def _get_effects():
            response = client.query_assertions(
                """
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
                SELECT ?effect ?label WHERE {
                    ?effect rdf:type <http://purl.org/twc/policy/Effect>.
                    ?effect rdfs:label ?label.
                }
                """
            )
            return [Condition(*r) for r in response]

        def _get_precedences():
            response = client.query_assertions(
                """
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
                SELECT ?precedence ?label WHERE { 
                    ?precedence rdfs:subClassOf+ <http://purl.org/twc/policy/Precedence>. 
                    ?precedence rdfs:label ?label. 
                }
                """
            )
            return [Condition(*r) for r in response]

        #
        # still no query for obligations
        #
        # def _get_obligations():
        #     return client.query_assertions(
        #         """
        #         """
        #     )
        #

        @controller.route('/', methods=['GET'])
        def get_conditions():
            logger.info('GETTING ATTRIBUTES')

            results = {
                'action': _get_actions(),
                'effect': _get_effects(),
                'precedence': _get_precedences()
            }

            return jsonify(results)

        return controller
