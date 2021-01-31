from pathlib import Path

from flask import current_app
from rdflib.util import guess_format
from twks.nanopub import Nanopublication

from .ontologies_blueprint import ontologies_blueprint

remote_ontologies = [
    'http://purl.obolibrary.org/obo/uo.owl'
]

@ontologies_blueprint.before_app_first_request
def load_ontologies(self):
    """Add ontologies into twks-server"""
    files = Path(current_app.config['ONTOLOGY_PATH']).glob('*')
    for f in files:
        path = f.as_posix()
        pub = Nanopublication.parse_assertions(source=path,
                                               format=guess_format(path))
        current_app.store.put_nanopublication(pub)

    for ontology in remote_ontologies:
        pub = Nanopublication.parse_assertions(source=ontology,
                                               format=guess_format(ontology))
        current_app.store.put_nanopublication(pub)
