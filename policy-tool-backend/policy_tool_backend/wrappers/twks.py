import glob
import logging
from pathlib import Path

from rdflib import RDFS, Graph, URIRef
import rdflib

from twks.client import TwksClient
from twks.nanopub import Nanopublication

from ..models.data import Attribute
from ..rdf.common import OWL, RDF, RDFS, SIO

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

remote_ontologies = [
    'http://purl.obolibrary.org/obo/uo.owl'
]


class TwksClientWrapper:
    def __init__(self, **kwargs):
        self.client = TwksClient(**kwargs)

    def load_ontologies(self, ontology_path: str):
        """
        Add ontologies into twks-server
        """
        logger.info('Loading ontologies')
        files = Path(ontology_path).glob('*')
        for f in files:
            path = f.as_posix()
            pub = Nanopublication.parse_assertions(source=path,
                                                   format=rdflib.util.guess_format(path))
            self.client.put_nanopublication(pub)
        for ontology in remote_ontologies:
            pub = Nanopublication.parse_assertions(source=ontology,
                                                   format=rdflib.util.guess_format(ontology))
            self.client.put_nanopublication(pub)

    def save(self, pub: Nanopublication):
        self.client.put_nanopublication(pub)

    def query_rdfs_subclasses(self, super_class: str) -> list:
        return self.client.query_assertions(
            '''
            SELECT ?value ?label 
            WHERE { 
                ?value rdfs:subClassOf+ ?superClass;
                       rdfs:label ?label . 
            }''',
            initNs={'rdfs': RDFS},
            initBindings={'superClass': URIRef(super_class)})

    def query_rdf_type(self, rdf_type: URIRef):
        return self.client.query_assertions(
            '''
            SELECT ?value ?label WHERE {
                ?value rdf:type ?type ;
                       rdfs:label ?label.
            }''',
            initNs={'rdf': RDF, 'rdfs': RDFS},
            initBindings={'type': URIRef(type_)})

    def query_attributes(self):
        return self.client.query_assertions(
            '''
            SELECT DISTINCT ?uri ?label ?property ?range ?propertyType ?extent ?cardinality ?unitLabel
            WHERE {
                ?uri rdfs:label ?label; 
                     rdfs:subClassOf+ sio:Attribute;
                     (rdfs:subClassOf|owl:equivalentClass|(owl:intersectionOf/rdf:rest*/rdf:first))* ?superClass.
                {
                    ?superClass owl:onProperty ?property;
                                owl:someValuesFrom|owl:allValuesFrom ?range;
                                ?extent ?range .
                    optional { ?property rdf:type ?propertyType }
                    optional { 
                        ?superClass owl:onProperty sio:hasUnit . 
                        ?range rdfs:label ?unitLabel .
                    }
                } UNION {
                    ?superClass owl:onDataRange ?range;
                                owl:onProperty ?property;
                                owl:minQualifiedCardinality|owl:maxQualifiedCardinality|owl:qualifiedCardinality ?cardinality;
                                ?extent ?cardinality .
                    bind(owl:DatatypeProperty as ?propertyType)
                } UNION {
                    ?superClass owl:onClass ?range;
                                owl:onProperty ?property;
                                owl:minQualifiedCardinality|owl:maxQualifiedCardinality|owl:qualifiedCardinality ?cardinality;
                                ?extent ?cardinality .
                    bind(owl:ObjectProperty as ?propertyType)
                } UNION {
                    ?superClass owl:onProperty ?property;
                                owl:minCardinality|owl:maxCardinality|owl:exactCardinality ?cardinality;
                                ?extent ?cardinality.
                    optional { ?property rdf:type ?propertyType }
                } UNION {
                    ?property rdfs:domain ?superClass;
                              rdfs:range ?range .
                    optional { ?property rdf:type ?propertyType }
                }
            }''',
            initNs={'rdfs': RDFS, 'rdf': RDF, 'sio': SIO, 'owl': OWL})

    def query_is_subclass(self, uri: str, super_class: str):
        return self.client.query_assertions(
            'ASK { ?uri rdfs:subClassOf+ ?super_class}',
            initNs={'rdfs': RDFS},
            initBindings={'uri': URIRef(uri), 'super_class': URIRef(super_class)})
