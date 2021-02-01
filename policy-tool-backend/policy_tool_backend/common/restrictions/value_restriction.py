from typing import Union

from rdflib.term import Identifier

from ..graphable import Graphable
from ..namespaces import SIO
from .extent import Extent
from .restriction import Restriction


class ValueRestriction(Restriction):
    def __init__(self, extent: Extent, range_: Union[Identifier, Graphable]):
        super().__init__(SIO.hasValue, extent, range_)
