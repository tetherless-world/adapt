import logging

from flask import Blueprint, current_app, jsonify
from twks.client import TwksClient

from ..models.Attribute import Attribute
from ..models.AttributeResponseDTO import AttributeResponseDTO
from .common.ClientControllerBlueprint import ClientControllerBlueprint

# configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


PROV_ATTR = [
    AttributeResponseDTO('http://www.w3.org/ns/prov#startTime',
                         'Start time',
                         'http://www.w3.org/2001/XMLSchema#dateTime'),
    AttributeResponseDTO('http://www.w3.org/ns/prov#endTime',
                         'End time',
                         'http://www.w3.org/2001/XMLSchema#dateTime'),
    AttributeResponseDTO('http://www.w3.org/ns/prov#Agent',
                         'Agent',
                         'http://www.w3.org/2001/XMLSchema#string'),
    AttributeResponseDTO('http://www.w3.org/ns/prov#Location',
                         'Location',
                         'http://www.w3.org/2001/XMLSchema#string'),
]


class AttributeControllerBP(ClientControllerBlueprint):

    @staticmethod
    def build(client, url_prefix):
        controller = Blueprint('attribute_controller',
                               __name__,
                               url_prefix=url_prefix)

        @controller.route('/', methods=['GET'])
        def get_attributes():
            logger.info('GETTING ATTRIBUTES')

            response = client.query_assertions(
                """
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX owl: <http://www.w3.org/2002/07/owl#>
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                PREFIX sio: <http://semanticscience.org/resource/>
                SELECT distinct ?attribute ?label ?property ?range ?propertyType ?extent ?cardinality WHERE {
                    ?attribute rdfs:label ?label.
                    ?attribute rdfs:subClassOf+ sio:Attribute.
                    ?attribute (rdfs:subClassOf|owl:equivalentClass|(owl:intersectionOf/rdf:rest*/rdf:first))* ?superClass.
                    {
                        ?superClass owl:onProperty ?property.
                        ?superClass owl:someValuesFrom|owl:allValuesFrom ?range.
                        ?superClass ?extent ?range.
                        optional { ?property rdf:type ?propertyType }
                    } union {
                        ?superClass owl:onDataRange ?range.
                        ?superClass owl:onProperty ?property.
                        ?superClass owl:minQualifiedCardinality|owl:maxQualifiedCardinality|owl:qualifiedCardinality ?cardinality.
                        ?superClass ?extent ?cardinality.
                        bind(owl:DatatypeProperty as ?propertyType)
                    } union {
                        ?superClass owl:onClass ?range.
                        ?superClass owl:onProperty ?property.
                        ?superClass owl:minQualifiedCardinality|owl:maxQualifiedCardinality|owl:qualifiedCardinality ?cardinality.
                        ?superClass ?extent ?cardinality.
                        bind(owl:ObjectProperty as ?propertyType)
                    } union {
                        ?superClass owl:onProperty ?property.
                        ?superClass owl:minCardinality|owl:maxCardinality|owl:exactCardinality ?cardinality.
                        ?superClass ?extent ?cardinality.
                        optional { ?property rdf:type ?propertyType }
                    } union {
                        ?property rdfs:domain ?superClass;
                                rdfs:range ?range.
                        optional { ?property rdf:type ?propertyType }
                    }
                }
                """
            )

            attributes = [Attribute(*attr) for attr in response]

            return jsonify([*PROV_ATTR,
                            *[AttributeResponseDTO(attr.uri,
                                                   attr.label,
                                                   attr.range)
                                for attr in attributes
                                if str(attr.propertyType) == "http://www.w3.org/2002/07/owl#DatatypeProperty"
                              ]])

        return controller
