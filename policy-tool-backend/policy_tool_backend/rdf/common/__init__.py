from rdflib import Graph

from .namespaces import (DSA_POL, DSA_T, HEALTH_POL, HEALTH_T, OWL, POL, PROV,
                         RDF, RDFS, REQ, SIO, SKOS, XSD, namespace_manager)


def graph_factory():
    g = Graph()
    g.namespace_manager = namespace_manager
    return g
