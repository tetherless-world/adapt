from typing import List, Optional, Union

from rdflib import OWL, RDF, RDFS
from rdflib.term import BNode, Identifier, Literal, URIRef

from ..graph_factory import graph_factory
from ..graphable import Graphable, GraphableError


class Class(Graphable):
    """
    An `owl:Class` object

    Attributes
    ----------
    identifier : Identifier, optional
        Identifier corresponding to root node of this object, by default BNode()
    label : Optional[str], optional
        `rdf:label` corresponding to this class, by default None
    definition : Optional[str], optional
        `skos:definition` corresponding to this class, by default None
    rdf_type : Identifier, optional
        `rdf:type` corresponding to this class, by default OWL.Class
    equivalent_class : Union[Identifier, Graphable], optional
        `owl:equivalentClass` corresponding to this object, by default None
    subclass_of : List[Union[Identifier, Graphable]], optional
        List of RDF entities [Identifier or Graphable] for which this object is `rdfs:subClassOf`, by default []
    """

    def __init__(self,
                 identifier: Identifier = BNode(),
                 label: Optional[str] = None,
                 definition: Optional[str] = None,
                 rdf_type: Optional[Identifier] = OWL.Class,
                 equivalent_class: Optional[Union[Identifier,
                                                  Graphable]] = None,
                 subclass_of: Optional[List[Union[Identifier, Graphable]]] = None):
        """
        An `owl:Class` object

        Parameters
        ----------
        identifier : Identifier, optional
            Identifier corresponding to root node of this object, by default BNode()
        label : Optional[str], optional
            `rdf:label` corresponding to this class, by default None
        definition : Optional[str], optional
            `skos:definition` corresponding to this class, by default None
        rdf_type : Identifier, optional
            `rdf:type` corresponding to this object, by default OWL.Class
        equivalent_class : Union[Identifier, Graphable], optional
            `owl:equivalentClass` corresponding to this object, by default None
        subclass_of : List[Union[Identifier, Graphable]], optional
             List of RDF entities [Identifier or Graphable] for which this object is `rdfs:subClassOf`, by default []
        """
        self.identifier = identifier
        self.label = label
        self.definition = definition
        self.equivalent_class = equivalent_class

        self.subclass_of = []
        if subclass_of:
            self.subclass_of.extend(subclass_of)

        self.rdf_type = rdf_type

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

        root = graph.resource(self.identifier)

        if self.rdf_type != None:
            root.add(RDF.type, self.rdf_type)

        if self.label != None:
            root.add(RDFS.label, Literal(self.label))

        if self.equivalent_class != None:
            if isinstance(self.equivalent_class, Identifier):
                root.add(OWL.equivalentClass, self.equivalent_class)
            elif isinstance(self.equivalent_class, Graphable):
                subgraph, subroot = self.equivalent_class.to_graph()
                graph += subgraph
                root.add(OWL.equivalentClass, subroot)
            else:
                raise GraphableError

        for super_class in self.subclass_of:
            if isinstance(super_class, Identifier):
                root.add(RDFS.subClassOf, super_class)
            elif isinstance(super_class, Graphable):
                subgraph, subroot = super_class.to_graph()
                graph += subgraph
                root.add(RDFS.subClassOf, subroot)
            else:
                raise GraphableError

        return (graph, root.identifier)
