from dataclasses import dataclass

@dataclass
class Action:
    """Class for representing an action"""
    uri: str
    label: str