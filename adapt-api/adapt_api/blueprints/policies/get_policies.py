from dataclasses import dataclass
from uuid import UUID

from flask import current_app, jsonify
from rdflib import RDFS

from ...common import POL
from .policies_blueprint import policies_blueprint


@dataclass
class PolicyDTO:
    uuid: UUID
    uri: str
    label: str


@policies_blueprint.route('')
def get_policies():
    results = current_app.store.query_nanopublications(
        '''
        prefix np: <http://www.nanopub.org/nschema#>
        SELECT ?uuid ?uri ?label WHERE { 
            GRAPH ?H { 
                ?uuid np:hasAssertion ?A 
            } GRAPH ?A {
                ?uri a pol:Policy ;
                    rdfs:label ?label .
            } 
        }
        ''',
        initNs={'rdfs': RDFS, 'pol': POL})

    policies = [PolicyDTO(UUID(r.uuid), r.uri, r.label) for r in results]

    return jsonify(policies)
