import logging

from flask import Blueprint, current_app, jsonify
from twks.client import TwksClient

from .common.ClientControllerBlueprint import ClientControllerBlueprint

# configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class DomainControllerBP(ClientControllerBlueprint):

    @staticmethod
    def build(client, url_prefix):
        controller = Blueprint('domain_controller',
                               __name__,
                               url_prefix=url_prefix)

        @controller.route('/', methods=['GET'])
        def get_domains():
            logging.info('Retrieving domains')
            response = client.query_assertions(
                """
                PREFIX owl: <http://www.w3.org/2002/07/owl#>
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                SELECT ?ont
                WHERE { 
                    ?ont rdf:type owl:Ontology
                }
                """
            )
            return jsonify([r for (r,) in response])

        return controller
