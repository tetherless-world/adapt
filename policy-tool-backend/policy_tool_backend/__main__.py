from .config import get_current_config
from .server import app_factory

app = app_factory(get_current_config())
app.run(host=app.config['HOST'], port=app.config['PORT'])
