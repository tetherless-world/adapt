from dataclasses import dataclass

@dataclass
class Effect:
    """Class for representing an effect"""
    uri: str
    label: str