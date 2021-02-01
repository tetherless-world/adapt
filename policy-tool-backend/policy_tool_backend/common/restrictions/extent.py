from enum import Enum

from rdflib import OWL


class Extent(Enum):
    VALUE = OWL.hasValue
    SOME = OWL.someValuesFrom
    ALL = OWL.allValuesFrom
