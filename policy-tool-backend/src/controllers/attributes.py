import logging
from string import Template

from flask import Blueprint, current_app, jsonify
from twks.client import TwksClient

from ..models.attributes.Attribute import Attribute
from ..models.attributes.AttributeResponseDTO import AttributeResponseDTO
from ..models.attributes.OwlClassAttributeResponseDTO import OwlClassAttributeResponseDTO
from ..models.common.QueryResponse import QueryResponse
from .common.ClientControllerBlueprint import ClientControllerBlueprint

# configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class AttributeControllerBP(ClientControllerBlueprint):

    @staticmethod
    def build(client, url_prefix):
        controller = Blueprint('attribute_controller',
                               __name__,
                               url_prefix=url_prefix)

        PROV_ATTR = [
            {
                'uri': 'http://www.w3.org/ns/prov#startTime',
                'label': 'Start time',
                # 'property': '',
                'range': 'http://www.w3.org/2001/XMLSchema#dateTime',
                'propertyType': 'http://www.w3.org/2002/07/owl#DatatypeProperty',
                # 'extent': '',
                # 'cardinality': ''
            },
            {
                'uri': 'http://www.w3.org/ns/prov#endTime',
                'label': 'End time',
                # 'property': '',
                'range': 'http://www.w3.org/2001/XMLSchema#dateTime',
                'propertyType': 'http://www.w3.org/2002/07/owl#DatatypeProperty',
                # 'extent': '',
                # 'cardinality': ''
            },
            {
                'uri': 'http://www.w3.org/ns/prov#Agent',
                'label': 'Agent',
                # 'property': '',
                'range': 'http://www.w3.org/2002/07/owl#Class',
                # 'propertyType': '',
                # 'extent': '',
                # 'cardinality': ''
            },
            {
                'uri': 'http://www.w3.org/ns/prov#Location',
                'label': 'Location',
                # 'property': '',
                'range': 'http://www.w3.org/2002/07/owl#Class',
                # 'propertyType': '',
                # 'extent': '',
                # 'cardinality': ''
            },
        ]

        def get_subclasses(super_uri):
            logger.info(super_uri)
            response = client.query_assertions(
                """
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                PREFIX prov: <http://www.w3.org/ns/prov#>
                select ?value ?label where {
                    ?value rdfs:subClassOf+ <""" + str(super_uri) + """>.
                    ?value rdfs:label ?label
                }
                """
            )
            return [QueryResponse(*r) for r in response]

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

            attributes = [*[Attribute(**attr) for attr in PROV_ATTR],
                          *[Attribute(*attr) for attr in response]]

            results = []
            for attr in attributes:
                if str(attr.propertyType) == "http://www.w3.org/2002/07/owl#DatatypeProperty":
                    results.append(AttributeResponseDTO(attr))
                elif str(attr.range) == "http://www.w3.org/2002/07/owl#Class":
                    results.append(OwlClassAttributeResponseDTO(
                        attr,
                        get_subclasses(attr.uri)
                    ))
            return jsonify(results)

        return controller
