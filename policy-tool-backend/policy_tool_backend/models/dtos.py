from typing import List

class RequestPostDTO:
    """Request POST DTO Class"""

    def __init__(self, data: dict):
        self.id: str = data['id']
        self.label: str = data['label']
        self.definition: str = data['definition']
        self.attributes: List[dict] = data['attributes']