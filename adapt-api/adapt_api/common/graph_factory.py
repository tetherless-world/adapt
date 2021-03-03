from typing import Optional

from rdflib import Graph, URIRef

from .namespace_manager import namespace_manager


def graph_factory(identifier: Optional[URIRef] = None):
    g = Graph(identifier=identifier, namespace_manager=namespace_manager)
    return g
