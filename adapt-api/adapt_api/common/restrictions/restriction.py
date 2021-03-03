from typing import List, Optional, Union

from rdflib import OWL, RDF, RDFS
from rdflib.term import BNode, Identifier, Literal, URIRef

from ..graph_factory import graph_factory
from ..graphable import Graphable, GraphableError

from .extent import Extent


class Restriction(Graphable):
    """
    An owl:Restriction object

    Attributes
    ----------
    on_property : Identifier
        Identifier of propert which is restricted by this object 
    extent_ : Extent
        Extent to which the range is restricted
    range_ : Union[Identifier, Graphable]
        Value of the restriction
    """

    def __init__(self, on_property: Identifier, extent: Extent, range_: Union[Identifier, Graphable]):
        """
        An owl:Restriction object

        Parameters
        ----------
        on_property : Identifier
            Identifier of propert which is restricted by this object 
        extent_ : Extent
            Extent to which the range is restricted
        range_ : Union[Identifier, Graphable]
            Value of the restriction
        """
        self.on_property = on_property
        self.extent = extent
        self.range_ = range_

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

        root = graph.resource(BNode())
        root.add(RDF.type, OWL.Restriction)
        root.add(OWL.onProperty, self.on_property)

        if isinstance(self.range_, Graphable):
            subgraph, subroot = self.range_.to_graph()
            graph += subgraph
            root.add(self.extent.value, subroot)
        elif isinstance(self.range_, Identifier):
            root.add(self.extent.value, self.range_)
        else:
            raise Exception

        return (graph, root.identifier)
