from flask import current_app
from rdflib import URIRef
from rdflib.namespace import RDF, RDFS

ask_is_subclass_query = 'ASK { ?uri rdfs:subClassOf+ ?superClass }'

select_label_by_uri_query = '''
SELECT ?label WHERE {
    ?uri rdfs:label ?label .
}
'''

select_subclass_by_superclass_query = '''
SELECT ?subclass ?label WHERE { 
    ?subclass rdfs:subClassOf+ ?superClass;
              rdfs:label ?label . 
}'''

select_uri_by_type_query = '''
SELECT ?uri ?label WHERE {
    ?uri rdf:type ?type ;
         rdfs:label ?label.
}
'''


def ask_is_subclass(uri: str, super_class: str):
    return current_app.store.query_assertions(ask_is_subclass_query,
                                              initNs={'rdfs': RDFS},
                                              initBindings={
                                                  'uri': URIRef(uri),
                                                  'superClass': URIRef(super_class)
                                              })


def select_label_by_uri(uri: str):
    return current_app.store.query_assertions(select_label_by_uri_query, initNs={'rdfs': RDFS},
                                              initBindings={'uri': URIRef(uri)})


def select_subclasses_by_superclass(super_class: str):
    return current_app.store.query_assertions(select_subclass_by_superclass_query,
                                              initNs={'rdfs': RDFS},
                                              initBindings={'superClass': super_class})


def select_uris_by_type(type_: str):
    return current_app.store.query_assertions(select_uri_by_type_query,
                                              initNs={'rdf': RDF,
                                                      'rdfs': RDFS},
                                              initBindings={'type': type_})
