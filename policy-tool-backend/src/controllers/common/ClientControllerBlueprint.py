from abc import ABC, abstractmethod


class ClientControllerBlueprint(ABC):

    @staticmethod
    @abstractmethod
    def build(client, url_prefix):
        ...
