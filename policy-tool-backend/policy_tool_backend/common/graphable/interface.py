from abc import ABC, abstractmethod
from typing import Tuple

from rdflib import Graph
from rdflib.term import Identifier

from .error import GraphableError


class Graphable(ABC):
    """
    Graphable interface.
    Subclasses of this class must be capable of representing as a RDFLib Graph
    """

    @abstractmethod
    def to_graph(self) -> Tuple[Graph, Identifier]:
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
        ...
