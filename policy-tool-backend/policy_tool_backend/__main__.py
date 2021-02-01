from .app_factory import app_factory

app = app_factory(__name__)

app.run(host=app.config['API_HOST'], port=app.config['API_PORT'])
