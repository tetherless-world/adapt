from typing import List, Tuple

from rdflib import OWL, RDF, BNode, URIRef
from rdflib.term import Identifier

from ..graph_factory import graph_factory
from ..graphable import Graphable


class RestrictedDatatype(Graphable):
    def __init__(self, on_datatype: Identifier, with_restrictions: List[Tuple[Identifier, Identifier]] = []):
        self.on_datatype = on_datatype
        self.with_restrictions = with_restrictions

    def to_graph(self):
        """
        Converts the class into a RDFLib Graph representation

        Returns
        -------
        Tuple[Graph, Identifier]
            (RDFLib Graph representing the object, RDFLib Identifier corresponding to the root node of the Graph)

        Raises
        ------
        Exception
            [description]
        """
        graph = graph_factory()
        c = graph.collection(BNode())

        for p, o in self.with_restrictions:
            subroot = graph.resource(BNode())
            subroot.add(p, o)
            c.append(subroot.identifier)

        root = graph.resource(BNode())

        root.add(RDF.type, OWL.Datatype)
        root.add(OWL.onDatatype, URIRef(self.on_datatype))
        root.add(OWL.withRestrictions, c.uri)

        return (graph, root.identifier)
