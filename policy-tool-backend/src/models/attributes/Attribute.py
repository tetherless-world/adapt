from dataclasses import dataclass
from ..common.QueryResponse import QueryResponse


@dataclass
class Attribute(QueryResponse):
    """Class for representing an attribute"""
    property: str = ''
    range: str = ''
    propertyType: str = ''
    extent: str = ''
    cardinality: str = ''
