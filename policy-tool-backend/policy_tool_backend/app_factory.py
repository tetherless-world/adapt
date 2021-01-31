from .app import App
from .config import get_config
from .store import get_store


def default(self, o):
    try:
        s = str(o)
    except TypeError:
        pass
    else:
        return s
    return json.JSONEncoder.default(self, o)


def app_factory(name):
    app = App(name)
    config = get_config()
    app.config.from_object(config)

    store = get_store(app.config['KNOWLEDGE_STORE_HOST'],
                      app.config['KNOWLEDGE_STORE_PORT'])

    app.register_store(store)
    app.json_encoder.default = default

    return app
