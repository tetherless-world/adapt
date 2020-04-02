from dataclasses import dataclass, field
from typing import List

from .Attribute import Attribute
from .AttributeResponseDTO import AttributeResponseDTO
from ..common.QueryResponse import QueryResponse


@dataclass
class OwlClassAttributeResponseDTO(AttributeResponseDTO):
    """Class for representing an Owl attribute response"""
    subClasses: List[QueryResponse]

    def __init__(self, attribute: Attribute, subClasses: List[QueryResponse] = None):
        super().__init__(attribute)
        self.subClasses: List[QueryResponse] = subClasses
