from operator import itemgetter

from flask import current_app, jsonify
from rdflib import PROV, RDF, RDFS

from ...common import POL
from ...common.utils import to_option_list
from .precedences_blueprint import precedences_blueprint

get_precedences_query = '''
SELECT ?uri ?label WHERE {
    ?uri rdfs:subClassOf+ ?superClass;
           rdfs:label ?label .
    FILTER NOT EXISTS { ?uri rdf:type pol:Policy }
}
'''


@precedences_blueprint.route('')
def get_precedences():
    results = current_app.store.query_assertions(
        get_precedences_query,
        initNs={'rdf': RDF, 'rdfs': RDFS, 'pol': POL},
        initBindings={'superClass': POL.Precedence})

    precedences = to_option_list(results)
    sorted_precedences = sorted(precedences, key=itemgetter('label'))

    response = {'validPrecedences': sorted_precedences}
    return jsonify(response)
