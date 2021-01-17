from typing import Optional

from rdflib import Graph, URIRef

from .namespaces import (DSA_POL, DSA_T, HEALTH_POL, HEALTH_T, OWL, POL, PROV,
                         RDF, RDFS, REQ, SIO, SKOS, XSD, namespace_manager)


def graph_factory(identifier: Optional[URIRef] = None):
    g = Graph(identifier=identifier, namespace_manager=namespace_manager)
    return g
