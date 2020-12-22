import glob
import logging
from pathlib import Path

from rdflib import RDFS, Graph, URIRef

from twks.client import TwksClient
from twks.nanopub import Nanopublication

from ..models.data import Attribute
from ..rdf.common import OWL, RDF, RDFS, SIO

logger = logging.getLogger(__name__)


class TwksClientWrapper:
    def __init__(self, **kwargs):
        self.client = TwksClient(**kwargs)

    def load_ontologies(self, ontology_path: str):
        """
        Add ontologies into twks-server
        """
        logger.info('Loading ontologies.')
        files = Path(ontology_path).glob('*.ttl')
        for f in files:
            pub = Nanopublication.parse_assertions(source=f.open(),
                                                   format='ttl')
            self.client.put_nanopublication(pub)
            logger.info(f'Loaded {f.name}')

    def save(self, pub: Nanopublication):
        self.client.put_nanopublication(pub)

    def query_rdfs_subclasses(self, super_class: str) -> list:
        res = self.client.query_assertions(
            '''
            SELECT ?val ?label WHERE { 
                ?val rdfs:subClassOf+ ?super_class.
                ?val rdfs:label ?label. 
            }''',
            initNs={'rdfs': RDFS},
            initBindings={'super_class': URIRef(super_class)})
        return [{'value': str(a), 'label': str(b)} for (a, b) in res]

    def query_rdf_type(self, rdf_type: URIRef):
        res = self.client.query_assertions(
            '''
            SELECT ?val ?label WHERE {
                ?val rdf:type ?rdf_type.
                ?val rdfs:label ?label.
            }''',
            initNs={'rdf': RDF, 'rdfs': RDFS},
            initBindings={'rdf_type': URIRef(rdf_type)})
        return [{'value': str(a), 'label': str(b)} for (a, b) in res]

    def query_attributes(self):
        res = self.client.query_assertions(
            '''
            SELECT DISTINCT ?attribute ?label ?property ?range ?propertyType ?extent ?cardinality 
            WHERE {
                ?attribute rdfs:label ?label.
                ?attribute rdfs:subClassOf+ sio:Attribute.
                ?attribute (rdfs:subClassOf|owl:equivalentClass|(owl:intersectionOf/rdf:rest*/rdf:first))* ?superClass.
                {
                    ?superClass owl:onProperty ?property.
                    ?superClass owl:someValuesFrom|owl:allValuesFrom ?range.
                    ?superClass ?extent ?range.
                    optional { ?property rdf:type ?propertyType }
                } UNION {
                    ?superClass owl:onDataRange ?range.
                    ?superClass owl:onProperty ?property.
                    ?superClass owl:minQualifiedCardinality|owl:maxQualifiedCardinality|owl:qualifiedCardinality ?cardinality.
                    ?superClass ?extent ?cardinality.
                    bind(owl:DatatypeProperty as ?propertyType)
                } UNION {
                    ?superClass owl:onClass ?range.
                    ?superClass owl:onProperty ?property.
                    ?superClass owl:minQualifiedCardinality|owl:maxQualifiedCardinality|owl:qualifiedCardinality ?cardinality.
                    ?superClass ?extent ?cardinality.
                    bind(owl:ObjectProperty as ?propertyType)
                } UNION {
                    ?superClass owl:onProperty ?property.
                    ?superClass owl:minCardinality|owl:maxCardinality|owl:exactCardinality ?cardinality.
                    ?superClass ?extent ?cardinality.
                    optional { ?property rdf:type ?propertyType }
                } UNION {
                    ?property rdfs:domain ?superClass;
                            rdfs:range ?range.
                    optional { ?property rdf:type ?propertyType }
                }
            }''',
            initNs={'rdfs': RDFS, 'rdf': RDF, 'sio': SIO, 'owl': OWL})
        return [Attribute(*r) for r in res]

    def query_is_subclass(self, uri: str, super_class: str):
        return self.client.query_assertions(
            'ASK { ?uri rdfs:subClassOf+ ?super_class}',
            initNs={'rdfs': RDFS},
            initBindings={'uri': URIRef(uri), 'super_class': URIRef(super_class)})
