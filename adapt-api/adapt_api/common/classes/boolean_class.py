from typing import List, Optional, Union

from rdflib import OWL, RDF
from rdflib.term import BNode, Identifier, URIRef

from ..graph_factory import graph_factory
from ..graphable import Graphable, GraphableError


class BooleanClass(Graphable):
    """
    A class representing the owl:intersectionOf or owl:unionOf entities [Identifier or Graphable]

    Attributes
    ----------
    operation : OWL.intersectionOf or OWL.unionOf 
        Operation represented by this class.

    members : List[Union[Identifier, Graphable]], optional
        List of RDF entities [Identifier or Graphable] contained in the intersection/union, by default []
    """

    def __init__(self, operation: URIRef, members: Optional[List[Union[Identifier, Graphable]]] = None):
        """
        A class representing the owl:intersectionOf or owl:unionOf entities [Identifier or Graphable]

        Parameters
        ----------
        operation : OWL.intersectionOf or OWL.unionOf
            Operation represented by this class (owl:intersectionOf or owl:unionOf)

        members : List[Union[Identifier, Graphable]], optional
            List of RDF entities [Identifier or Graphable] contained in the intersection/union, by default []
        """
        self.operation = operation
        self.members = []
        if members:
            self.members.extend(members)

    def append(self, member: Union[Identifier, Graphable]):
        self.members.append(member)

    def extend(self, members: List[Union[Identifier, Graphable]]):
        self.members.extend(members)

    def to_graph(self):
        """
        Converts the class into a RDFLib Graph representation

        Returns
        -------
        Tuple[Graph, Identifier]
            (RDFLib Graph representing the object, RDFLib Identifier corresponding to the root node of the Graph)

        Raises
        ------
        GraphableError
            If an error occurs while converting to graph.
        """
        graph = graph_factory()

        # construct intersectionOf/unionOf structure
        c = graph.collection(BNode())
        for member in self.members:
            if isinstance(member, Identifier):
                c.append(member)
            elif isinstance(member, Graphable):
                subgraph, subroot = member.to_graph()
                graph += subgraph
                c.append(subroot)
            else:
                raise GraphableError

        # construct the root node in the graph
        root = graph.resource(BNode())
        root.add(RDF.type, OWL.Class)
        root.add(self.operation, c.uri)

        return (graph, root.identifier)
