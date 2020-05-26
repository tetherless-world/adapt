

class Attribute:
    """Class for representing attribute"""

    def __init__(self,
                 uri: str,
                 label: str,
                 property: str,
                 range: str,
                 property_type: str,
                 extent: str,
                 cardinality: str):
        self.uri = str(uri)
        self.label = str(label)
        self.property = str(property)
        self.range = str(range)
        self.property_type = str(property_type)
        self.extent = str(extent)
        self.cardinality = str(cardinality)

    def __repr__(self):
        return self.__dict__
