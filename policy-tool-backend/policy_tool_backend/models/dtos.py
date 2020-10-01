from typing import List

class RequestPostDTO:
    """Request POST DTO Class"""

    def __init__(self, data: dict):
        self.id: str = data['id']
        self.label: str = data['label']
        self.definition: str = data['definition']
        self.attributes: List[dict] = data['attributes']

class PolicyPostDTO:
    """Policy POST DTO Class"""

    def __init__(self, data):
        self.id: str = data['id']
        self.label: str = data['label']
        self.source: str = data['source']
        self.definition: str = data['definition']
        self.action: str = data['action']
        self.precedence: str = data['precedence']
        self.effects: List[dict] = data['effects']
        self.obligations: List[dict] = data['obligations']
        self.attributes: List[dict] = data['attributes']
