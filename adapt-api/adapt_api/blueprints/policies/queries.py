from flask import current_app
from rdflib import URIRef

get_policy_by_uri_query = 'DESCRIBE ?uri'

def get_policy_by_uri(uri: str):
    return current_app.store.query_nanopublications(get_policy_by_uri_query,
                                                    initBindings={'uri': URIRef(uri)})
