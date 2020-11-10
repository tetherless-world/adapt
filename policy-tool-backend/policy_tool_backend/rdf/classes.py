from abc import ABC, abstractmethod
from enum import Enum
from typing import List, Tuple, Union

from rdflib import Graph
from rdflib.term import BNode, Identifier, Literal, URIRef

from .common import OWL, POL, PROV, RDF, RDFS, SIO, graph_factory


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
        Exception
            [description]
        """
        ...


class BooleanOperation(Enum):
    """Enum representing boolean operations in OWL2"""
    INTERSECTION = OWL.intersectionOf
    UNION = OWL.unionOf


class BooleanClass(Graphable):
    """
    A class representing the owl:intersectionOf or owl:unionOf entities [Identifier or Graphable]

    Attributes
    ----------
    operation : BooleanOperation
        Operation represented by this class.

    members : List[Union[Identifier, Graphable]], optional
        List of RDF entities [Identifier or Graphable] contained in the intersection/union, by default []
    """

    def __init__(self, operation: BooleanOperation, members: List[Union[Identifier, Graphable]] = []):
        """
        A class representing the owl:intersectionOf or owl:unionOf entities [Identifier or Graphable]

        Parameters
        ----------
        operation : BooleanOperation
            Operation represented by this class (owl:intersectionOf or owl:unionOf)

        members : List[Union[Identifier, Graphable]], optional
            List of RDF entities [Identifier or Graphable] contained in the intersection/union, by default []
        """
        self.operation = operation
        self.members = members

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
                raise Exception

        # construct the root node in the graph
        root = graph.resource(BNode())
        root.add(RDF.type, OWL.Class)
        root.add(self.operation.value, c.uri)

        return (graph, root.identifier)


class Class(Graphable):
    """
    An `owl:Class` object

    Attributes
    ----------
    identifier : Identifier, optional
        Identifier corresponding to root node of this object, by default BNode()
    label : str, optional
        `rdf:label` corresponding to this object, by default None
    rdf_type : Identifier, optional
        `rdf:type` corresponding to this object, by default OWL.Class
    equivalent_class : Graphable, optional
        `owl:equivalentClass` corresponding to this object, by default None
    subclass_of : List[Union[Identifier, Graphable]], optional
        List of RDF entities [Identifier or Graphable] for which this object is `rdfs:subClassOf`, by default []
    """

    def __init__(self,
                 identifier: Identifier = BNode(),
                 label: str = None,
                 rdf_type: Identifier = OWL.Class,
                 equivalent_class: Union[Identifier, Graphable] = None,
                 subclass_of: List[Union[Identifier, Graphable]] = []):
        """
        An owl:Class object

        Parameters
        ----------
        identifier : Identifier, optional
            Identifier corresponding to root node of this object, by default BNode()
        label : str, optional
            `rdf:label` corresponding to this object, by default None
        rdf_type : Identifier, optional
            `rdf:type` corresponding to this object, by default OWL.Class
        equivalent_class : Graphable, optional
            `owl:equivalentClass` corresponding to this object, by default None
        subclass_of : List[Union[Identifier, Graphable]], optional
            List of RDF entities [Identifier or Graphable] for which this object is `rdfs:subClassOf`, by default []
        """
        self.identifier = identifier
        self.label = label
        self.equivalent_class = equivalent_class
        self.subclass_of = subclass_of
        self.rdf_type = rdf_type

    def to_graph(self):
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
                raise Exception

        for super_class in self.subclass_of:
            if isinstance(super_class, Identifier):
                root.add(RDFS.subClassOf, super_class)
            elif isinstance(super_class, Graphable):
                subgraph, subroot = super_class.to_graph()
                graph += subgraph
                root.add(RDFS.subClassOf, subroot)
            else:
                raise Exception

        return (graph, root.identifier)


class RestrictionKind(Enum):
    HAS_VALUE = OWL.hasValue
    SOME_VALUES_FROM = OWL.someValuesFrom
    ALL_VALUES_FROM = OWL.allValuesFrom
    MAX_CARDINALITY = OWL.maxCardinality
    MIN_CARDINALITY = OWL.minCardinality


class Restriction(Graphable):
    """
    An owl:Restriction object

    Attributes
    ----------
    on_property : Identifier
        Identifier of propert which is restricted by this object 
    restriction_kind : RestrictionKind
        Type of restriction on the property
    restriction_value : Union[Identifier, Graphable]
        Value of the restriction
    """

    def __init__(self,
                 on_property: Identifier,
                 restriction_kind: RestrictionKind,
                 restriction_value: Union[Identifier, Graphable]):
        """
        An owl:Restriction object

        Parameters
        ----------
        on_property : Identifier
            Identifier of propert which is restricted by this object 
        restriction_kind : RestrictionKind
            Type of restriction on the property
        restriction_value : Union[Identifier, Graphable]
            Value of the restriction
        """
        self.on_property = on_property
        self.restriction_kind = restriction_kind
        self.restriction_value = restriction_value

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

        root = graph.resource(BNode())
        root.add(RDF.type, OWL.Restriction)
        root.add(OWL.onProperty, self.on_property)

        if isinstance(self.restriction_value, Graphable):
            subgraph, subroot = self.restriction_value.to_graph()
            graph += subgraph
            root.add(self.restriction_kind.value, subroot)
        elif isinstance(self.restriction_value, Identifier):
            root.add(self.restriction_kind.value, self.restriction_value)
        else:
            raise Exception

        return (graph, root.identifier)


class AgentRestriction(Restriction):

    def __init__(self,
                 restriction_kind: RestrictionKind,
                 restriction_value: Union[Identifier, Graphable]):
        super().__init__(on_property=PROV.wasAssociatedWith,
                         restriction_kind=restriction_kind,
                         restriction_value=restriction_value)


class AttributeRestriction(Restriction):
    def __init__(self,
                 restriction_kind: RestrictionKind,
                 restriction_value: Union[Identifier, Graphable]):
        super().__init__(on_property=SIO.hasAttribute,
                         restriction_kind=restriction_kind,
                         restriction_value=restriction_value)


class ValueRestriction(Restriction):
    def __init__(self,
                 restriction_kind: RestrictionKind,
                 restriction_value: Union[Identifier, Graphable]):
        super().__init__(on_property=SIO.hasValue,
                         restriction_kind=restriction_kind,
                         restriction_value=restriction_value)


class RestrictedDatatype(Graphable):
    def __init__(self,
                 on_datatype: Identifier,
                 with_restrictions: List[Tuple[Identifier, Identifier]] = []):
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
