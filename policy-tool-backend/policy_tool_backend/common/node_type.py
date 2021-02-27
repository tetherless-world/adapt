from enum import IntEnum, auto
from numbers import Number

from rdflib import OWL, PROV, RDFS, XSD

from ..exceptions import Error
from .namespaces import SIO


class UnknownNodeTypeError(Error):
    pass


def is_named(n: dict):
    return '@id' in n and isinstance(n['@id'], str) and n['@id'][0] != '_'


def is_bnode(n: dict):
    return '@id' in n and isinstance(n['@id'], str) and n['@id'][0] == '_'


def is_literal(n: dict):
    return '@value' in n and (isinstance(n['@value'], str) or isinstance(n['@value'], Number))


def is_typed(n: dict):
    return '@type' in n and isinstance(n['@type'], str)


def is_datatype(n):
    return (is_typed(n)
            and n['@type'] == str(RDFS.Datatype)
            and str(OWL.onDatatype) in n
            and is_named(n[str(OWL.onDatatype)])
            and str(OWL.withRestrictions) in n
            and isinstance(n[str(OWL.withRestrictions)], list)
            and len(n[str(OWL.withRestrictions)]) > 0)


def is_class(n: dict):
    return is_typed(n) and n['@type'] == str(OWL.Class)


def is_intersection(n: dict):
    return (is_class(n)
            and str(OWL.intersectionOf) in n
            and isinstance(n[str(OWL.intersectionOf)], list)
            and len(n[str(OWL.intersectionOf)]) >= 2)


def is_restriction(n: dict):
    return (is_typed(n)
            and n['@type'] == str(OWL.Restriction)
            and str(OWL.onProperty) in n
            and (str(OWL.someValuesFrom) in n
                 or str(OWL.hasValue) in n))


def is_has_value_restriction(n):
    return (is_restriction(n)
            and n[str(OWL.onProperty)]['@id'] == str(SIO.hasValue)
            and ((str(OWL.someValuesFrom) in n and is_datatype(n[str(OWL.someValuesFrom)]))
                 or (str(OWL.hasValue) in n and is_literal(n[str(OWL.hasValue)]))))


def is_unit_restriction(n):
    return (is_restriction(n)
            and n[str(OWL.onProperty)]['@id'] == str(SIO.hasUnit)
            and (is_named(n[str(OWL.someValuesFrom)])
                 or (is_intersection(n[str(OWL.someValuesFrom)])
                     and len(n[str(OWL.someValuesFrom)]) == 2
                     and all([is_named(r)
                              for r in n[str(OWL.someValuesFrom)][str(OWL.intersectionOf)]]))))


def is_agent_restriction(n: dict):
    return (is_restriction(n)
            and n[str(OWL.onProperty)]['@id'] == str(PROV.wasAssociatedWith)
            and str(OWL.hasValue) not in n
            and (is_named(n[str(OWL.someValuesFrom)])
                 or is_restriction(n[str(OWL.someValuesFrom)])))


def is_attribute_restriction(n: dict):
    return (is_restriction(n)
            and n[str(OWL.onProperty)]['@id'] == str(SIO.hasAttribute)
            and str(OWL.hasValue) not in n
            and (is_named(n[str(OWL.someValuesFrom)])
                 or is_class(n[str(OWL.someValuesFrom)])))


def is_class_restriction(n: dict):
    return (is_attribute_restriction(n)
            and (is_named(n[str(OWL.someValuesFrom)])
                 or (is_intersection(n[str(OWL.someValuesFrom)])
                     and len(n[str(OWL.someValuesFrom)]) == 2
                     and all([is_named(r) for r in n[str(OWL.someValuesFrom)]]))))


def is_validity_restriction(n):
    return n[str(OWL.onProperty)]['@id'] in [str(PROV.startedAtTime), str(PROV.endedAtTime)]


class NodeType(IntEnum):
    NAMED = auto()
    AGENT = auto()
    CLASS = auto()
    ATTRIBUTE = auto()
    HAS_VALUE = auto()
    UNIT = auto()
    VALIDITY = auto()
    DATATYPE = auto()
    LITERAL = auto()
    BNODE = auto()

    @ classmethod
    def get_node_type(cls, n):
        if is_named(n):
            return cls.NAMED
        if is_bnode(n):
            return cls.BNODE

        if is_literal(n):
            return cls.LITERAL

        if is_restriction(n):
            if is_agent_restriction(n):
                if is_named(n[str(OWL.someValuesFrom)]):
                    return cls.AGENT
                elif is_restriction(n[str(OWL.someValuesFrom)]):
                    return cls.get_node_type(n[str(OWL.someValuesFrom)])
            if is_attribute_restriction(n):
                return cls.ATTRIBUTE
            if is_has_value_restriction(n):
                return cls.HAS_VALUE
            if is_unit_restriction(n):
                return cls.UNIT
            if is_validity_restriction(n):
                return cls.VALIDITY

        raise UnknownNodeTypeError(n)
