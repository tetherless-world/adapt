import json
from copy import deepcopy

from flask import abort, current_app, jsonify
from rdflib import OWL, PROV, RDFS, SKOS, XSD, Graph, URIRef, plugin
from rdflib.serializer import Serializer

from ...common.namespaces import POL
from ...common.node_type import NodeType, is_named
from ...common.queries import ask_is_subclass, select_label_by_uri
from .error import MalformedNodeError
from .policies_blueprint import policies_blueprint


def get_uri_from_nanopub(uuid):
    # this query breaks if ever there are multiple policies per nanopub
    potential_uri = current_app.store.query_nanopublications(
        '''
        prefix np: <http://www.nanopub.org/nschema#>
        SELECT ?uri WHERE {
            GRAPH ?H {
                ?uuid np:hasAssertion ?A
            } GRAPH ?A {
                ?uri a pol:Policy .
            }
        }
        ''',
        initNs={'pol': POL},
        initBindings={'uuid': URIRef(uuid.urn)}
    )
    return list(potential_uri).pop().uri


def get_policy_by_uri(uuid, uri):
    return current_app.store.query_nanopublications(
        '''
        PREFIX np: <http://www.nanopub.org/nschema#>
        PREFIX pol: <http://purl.org/twc/policy/>

        DESCRIBE ?uri WHERE {
            GRAPH ?H { 
                ?uuid np:hasAssertion ?A
            } GRAPH ?A {
                ?uri a pol:Policy .
            }
        }
        ''',
        initNs={'pol': POL},
        initBindings={'uuid': URIRef(uuid.urn),
                      'uri': URIRef(uri)})


@policies_blueprint.route('/<uuid:uuid>')
def get_policy(uuid):
    # if ordering is deterministic on describe, then get_uri is not necessary.
    uri = get_uri_from_nanopub(uuid)

    results = get_policy_by_uri(uuid, uri)

    if results.graph is None:
        abort(404, uuid)

    # convert to json-ld
    policy_json = (
        json.loads(
            results.graph.serialize(format='json-ld').decode('utf-8')
        )
    )
    current_app.logger.info(policy_json)

    # group nodes by id
    nodes_by_id = {node['@id']: node for node in policy_json}
    label_by_uri = {}

    def dfs(node_ref):
        if '@value' in node_ref:
            return {**node_ref, '@type': node_ref.get('@type') or XSD.string}

        node_uri = node_ref['@id']
        if node_uri[0] != '_':
            for r in select_label_by_uri(node_uri):
                label_by_uri[node_uri] = r.label
            return node_ref

        result = {}
        node = nodes_by_id[node_uri]

        if '@type' in node:
            if node['@type'][0] == str(RDFS.Datatype):

                if str(OWL.onDatatype) not in node and str(OWL.withRestrictions) not in node:
                    raise MalformedNodeError(node)

                result['@type'] = str(RDFS.Datatype)
                result[str(OWL.onDatatype)] = node[str(OWL.onDatatype)][0]
                result[str(OWL.withRestrictions)] = [dfs(n)
                                                     for n in node[str(OWL.withRestrictions)]]

            if node['@type'][0] == str(OWL.Restriction):
                if (str(OWL.onProperty) not in node
                        or (str(OWL.someValuesFrom) not in node and str(OWL.hasValue) not in node)):
                    raise MalformedNodeError(node)

                result['@type'] = str(OWL.Restriction)
                result[str(OWL.onProperty)] = node[str(OWL.onProperty)][0]

                if str(OWL.someValuesFrom) in node:
                    result[str(OWL.someValuesFrom)] = \
                        dfs(node[str(OWL.someValuesFrom)][0])
                elif str(OWL.hasValue) in node:
                    result[str(OWL.hasValue)] = dfs(node[str(OWL.hasValue)][0])

            if node['@type'][0] == str(OWL.Class):

                result['@type'] = str(OWL.Class)

                if str(OWL.intersectionOf) in node:

                    children = [dfs(c) for c in node[str(OWL.intersectionOf)]]
                    if len(children) == 2 and is_named(children[0]) and is_named(children[1]):
                        c0, c1 = children
                        if ask_is_subclass(c1['@id'], c0['@id']):
                            result[str(OWL.intersectionOf)] = [c0, c1]
                        else:
                            result[str(OWL.intersectionOf)] = [c1, c0]
                    else:
                        children.sort(key=NodeType.get_node_type)
                        result[str(OWL.intersectionOf)] = children

        if str(XSD.minInclusive) in node:
            result[str(XSD.minInclusive)] = node[str(XSD.minInclusive)][0]
        elif str(XSD.maxInclusive) in node:
            result[str(XSD.maxInclusive)] = node[str(XSD.maxInclusive)][0]

        return result

    root_node = nodes_by_id[str(uri)]
    policy = {}
    policy['@id'] = uri
    policy['@type'] = root_node['@type'][0]
    policy[RDFS.label] = root_node[str(RDFS.label)][0]['@value']
    policy[SKOS.definition] = root_node[str(SKOS.definition)][0]['@value']
    policy[RDFS.subClassOf] = sorted(root_node[str(RDFS.subClassOf)],
                                     key=lambda s: not ask_is_subclass(s['@id'], POL.Precedence))

    # add labels for precedence, effect to label_by_uri
    for r in select_label_by_uri(policy[RDFS.subClassOf][0]['@id']):
        label_by_uri[policy[RDFS.subClassOf][0]['@id']] = r.label
    for r in select_label_by_uri(policy[RDFS.subClassOf][1]['@id']):
        label_by_uri[policy[RDFS.subClassOf][1]['@id']] = r.label

    policy[OWL.equivalentClass] = dfs(root_node[str(OWL.equivalentClass)][0])

    return jsonify({'policy': policy, 'labelByURI': label_by_uri})
