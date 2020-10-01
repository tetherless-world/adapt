class Config(object):
    DEBUG = False
    TESTING = False
    ONTOLOGY_PATH = '../ontologies'
    API_URL = '/api'


class ProductionConfig(Config):
    """
    Production environment config (default)
    """
    TWKS_URL = 'http://twks-server:8080'
    HOST = '0.0.0.0'
    PORT = 5000


class DevelopmentConfig(Config):
    """
    Development environment config
    """
    DEBUG = True
    JSON_SORT_KEYS = False
    TWKS_URL = 'http://localhost:8080'
    HOST = '127.0.0.1'
    PORT = 5000
