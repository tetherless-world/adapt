from dataclasses import dataclass

@dataclass
class Precedence:
    """Class for representing an action"""
    uri: str
    label: str