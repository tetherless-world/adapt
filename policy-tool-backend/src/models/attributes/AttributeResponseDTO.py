from dataclasses import dataclass, field

from .Attribute import Attribute


@dataclass
class AttributeResponseDTO:
    """Class for representing an attribute response"""

    uri: str
    label: str
    value_type: str

    def __init__(self, attribute: Attribute):
        self.uri: str = attribute.uri
        self.label: str = attribute.label
        self.value_type: str = attribute.range