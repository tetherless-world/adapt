from dataclasses import dataclass


@dataclass
class AttributeResponseDTO:
    """Class for representing an attribute response"""
    attr_uri: str
    attr_label: str
    value_type: str

