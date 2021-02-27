import json
from pprint import pprint
from copy import deepcopy

from flask import current_app, jsonify, request, abort
from rdflib import OWL, RDFS, SKOS, XSD, Graph, plugin, PROV
from rdflib.serializer import Serializer

from ...common import POL, graph_factory
from ...common.node_type import NodeType, is_bnode, is_named
from ...common.queries import ask_is_subclass, get_label_by_uri
from .error import MalformedNodeError
from .policies_blueprint import policies_blueprint
from .queries import get_policy_by_uri


@policies_blueprint.route('')
def get_policy():
    uri = request.args.get('uri')
    triples = get_policy_by_uri(uri)

    g = graph_factory()
    for triple in triples:
        g.add(triple)

    # convert to json-ld
    policy_json = json.loads(g.serialize(format='json-ld').decode('utf-8'))

    # 404 if empty
    if not policy_json:
        abort(404, uri)

    # group nodes by id
    nodes_by_id = {node['@id']: node for node in policy_json}
    label_by_uri = {}

    def dfs(node_ref):
        if '@value' in node_ref:
            return {**node_ref, '@type': node_ref.get('@type') or XSD.string}

        node_uri = node_ref['@id']
        if node_uri[0] != '_':
            for r in get_label_by_uri(node_uri):
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

    root_node = nodes_by_id[uri]
    policy = {}
    policy['@id'] = uri
    policy['@type'] = root_node['@type'][0]
    policy[RDFS.label] = root_node[str(RDFS.label)][0]['@value']
    policy[SKOS.definition] = root_node[str(SKOS.definition)][0]['@value']
    policy[RDFS.subClassOf] = sorted(root_node[str(RDFS.subClassOf)],
                                     key=lambda s: not ask_is_subclass(s['@id'], POL.Precedence))

    # add labels for precedence, effect to label_by_uri
    for r in get_label_by_uri(policy[RDFS.subClassOf][0]['@id']):
        label_by_uri[policy[RDFS.subClassOf][0]['@id']] = r.label
    for r in get_label_by_uri(policy[RDFS.subClassOf][1]['@id']):
        label_by_uri[policy[RDFS.subClassOf][1]['@id']] = r.label

    policy[OWL.equivalentClass] = dfs(root_node[str(OWL.equivalentClass)][0])

    return jsonify({'policy': policy, 'labelByURI': label_by_uri})
