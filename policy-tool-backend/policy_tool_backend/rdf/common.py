from rdflib import Graph

from .namespaces import namespace_manager


def graph_factory():
    g = Graph()
    g.namespace_manager = namespace_manager
    return g
