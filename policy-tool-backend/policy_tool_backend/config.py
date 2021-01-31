import os


class Config(object):
    """Base configuration object"""
    ONTOLOGY_PATH = '../ontologies'
    API_URL = os.getenv('API_URL', '/api')
    API_HOST = os.getenv('API_HOST')
    API_PORT = os.getenv('API_PORT')
    KNOWLEDGE_STORE_HOST = os.getenv('KNOWLEDGE_STORE_HOST')
    KNOWLEDGE_STORE_PORT = os.getenv('KNOWELDGE_STORE_PORT')


class ProductionConfig(Config):
    """Production configuration object"""
    KNOWLEDGE_STORE_HOST = os.getenv('KNOWLEDGE_STORE_HOST', 'twks-server')
    KNOWLEDGE_STORE_PORT = os.getenv('KNOWELDGE_STORE_PORT', 8080)
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    API_PORT = os.getenv('API_PORT', 5000)


class DevelopmentConfig(Config):
    """Development configuration object"""
    API_HOST = os.getenv('API_HOST', 'localhost')
    API_PORT = os.getenv('API_PORT', 5000)
    KNOWLEDGE_STORE_HOST = os.getenv('KNOWLEDGE_STORE_HOST', 'localhost')
    KNOWLEDGE_STORE_PORT = os.getenv('KNOWELDGE_STORE_PORT', 8080)


def get_config() -> Config:
    if os.getenv('FLASK_ENV') == 'development':
        return DevelopmentConfig
    else:
        return ProductionConfig
