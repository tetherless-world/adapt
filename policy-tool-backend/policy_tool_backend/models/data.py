import dataclasses


@dataclasses.dataclass
class Attribute:
    """Attribute object class"""

    uri: str
    label: str
    property: str
    range: str
    property_type: str
    extent: str
    cardinality: str

    def __post_init__(self):
        # guarantee all strings
        self.uri = str(self.uri)
        self.label = str(self.label)
        self.property = str(self.property)
        self.range = str(self.range)
        self.property_type = str(self.property_type)
        self.extent = str(self.extent)
        self.cardinality = str(self.cardinality)
