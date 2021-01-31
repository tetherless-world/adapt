from flask import Flask
from twks.client import TwksClient


class App(Flask):
    def register_store(self, store: TwksClient):
        self.store: TwksClient = store
