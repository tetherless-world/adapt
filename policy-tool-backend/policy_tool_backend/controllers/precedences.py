from operator import itemgetter

from flask import Blueprint, current_app, jsonify
from rdflib.namespace import PROV, RDF, RDFS

from ..rdf.common.namespaces import POL
from .common.queries import get_uri_by_type

precedences_api = Blueprint('precedences', __name__, url_prefix='/api/precedences')

get_precedences_query = '''
SELECT ?uri ?label WHERE {
    ?value rdfs:subClassOf+ ?superClass;
           rdfs:label ?label .
    FILTER NOT EXISTS { ?value rdf:type pol:Policy }
}
'''


@precedences_api.route('/')
def get_precedences():
    results = current_app.store.query_assertions(get_precedences_query,
                                                 initNs={
                                                     'rdf': RDF,
                                                     'rdfs': RDFS,
                                                     'pol': POL
                                                 },
                                                 initBindings={'superClass', PROV.Precedence})
    sorted_results = sorted([{'value': row.uri, 'label': row.label} for row in results],
                            key=itemgetter('label'))
    response = {'validPrecedences': sorted_results}
    return jsonify(response)
