from typing import Union

from rdflib import PROV
from rdflib.term import Identifier

from ..graphable import Graphable
from .extent import Extent
from .restriction import Restriction


class EndTimeRestriction(Restriction):
    def __init__(self, extent: Extent, range_: Union[Identifier, Graphable]):
        super().__init__(PROV.endedAtTime, extent, range_)
