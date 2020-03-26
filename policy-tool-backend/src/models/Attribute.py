from dataclasses import dataclass


@dataclass
class Attribute:
    """Class for representing an attribute"""
    uri: str
    label: str
    property: str
    range: str
    propertyType: str
    extent: str
    cardinality: str
