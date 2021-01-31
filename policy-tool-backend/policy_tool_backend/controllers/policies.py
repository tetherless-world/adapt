import json
import logging
from operator import itemgetter
from typing import List

from flask import Blueprint, current_app, jsonify, request
from rdflib import Literal, URIRef, plugin
from rdflib.serializer import Serializer
from rdflib.namespace import OWL, PROV, RDF, RDFS, SKOS, XSD
from rdflib.util import guess_format
from twks.nanopub import Nanopublication

from ..rdf.classes import (AgentRestriction, AttributeRestriction,
                           BooleanClass, Class, EndTimeRestriction, Extent,
                           Graphable, RestrictedDatatype, StartTimeRestriction,
                           ValueRestriction)
from ..rdf.common import graph_factory
from ..rdf.common.namespaces import POL, SIO

policies_api = Blueprint('policies', __name__, url_prefix='/api/policies')

get_policy_by_uri_query = 'DESCRIBE ?uri'


def get_policy_by_uri(uri: str):
    return current_app.store.query_nanopublications(get_policy_by_uri_query,
                                                    initBindings={'uri': URIRef(uri)})


def build_policy(source: str,
                 id: str,
                 label: str,
                 definition: str,
                 action: str,
                 precedence: str,
                 activity_restrictions: List[dict],
                 agent_restrictions: List[dict],
                 effects: List[dict],
                 obligations: List[dict]):

    if not source:
        source = 'http://purl.org/twc/policy#'

    if source[-1] == '#' or source[-1] == '/':
        identifier = URIRef(f'{source}{id}')
    else:
        identifier = URIRef(f'{source}#{id}')

    root = Class(identifier=identifier, rdf_type=POL.Policy, label=label)

    if precedence:
        root.subclass_of.append(URIRef(precedence))

    if effects:
        root.subclass_of.extend([URIRef(e['value']) for e in effects])

    if obligations:
        root.subclass_of.extend([URIRef(o['value']) for o in obligations])

    def dfs(r: dict) -> Graphable:
        uri = URIRef(r['uri'])
        if 'restrictions' not in r and 'values' not in r:
            return uri

        range_ = BooleanClass(OWL.intersectionOf, [uri])
        if 'restrictions' in r:
            children = [dfs(c) for c in r['restrictions']]
            range_.extend(children)
            return AttributeRestriction(Extent.SOME, range_)

        if 'values' in r:
            v, t = itemgetter('value', 'type')(r['values'][0])
            if t == OWL.Class:
                range_.append(AttributeRestriction(Extent.SOME, URIRef(v)))
            else:
                constraints = []
                lit = Literal(v, datatype=t)
                if 'subClassOf' in r:
                    subclasses = [URIRef(s) for s in r['subClassOf']]
                    if SIO.MinimalValue in subclasses:
                        constraints.append((XSD.minInclusive, lit))
                    if SIO.MaximalValue in subclasses:
                        constraints.append((XSD.maxInclusive, lit))

                if not constraints:
                    range_.append(ValueRestriction(Extent.VALUE, lit))
                else:
                    dt = RestrictedDatatype(t, constraints)
                    range_.append(ValueRestriction(Extent.SOME, dt))

            return AttributeRestriction(Extent.SOME, range_)
        else:
            raise RuntimeError('Invalid attribute structure.')

    if not agent_restrictions and not activity_restrictions:
        eq_class = URIRef(action)
    else:
        eq_class = BooleanClass(OWL.intersectionOf, [URIRef(action)])
        # handle agent restrictions
        if agent_restrictions:
            agents = [dfs(a) for a in agent_restrictions]
            if len(agents) == 1:
                eq_agent = AgentRestriction(Extent.SOME, agents[0])
            else:
                eq_agent = AgentRestriction(Extent.SOME,
                                            BooleanClass(OWL.intersectionOf, agents))
            eq_class.append(eq_agent)

        # handle activity restrictions
        for r in activity_restrictions:
            ref = URIRef(r['uri'])
            v, t = [r['values'][0][k] for k in ['value', 'type']]

            if ref == PROV.Agent:
                eq_class.append(AgentRestriction(Extent.SOME, URIRef(v)))
            else:
                lit = Literal(v, datatype=t)
                if ref == PROV.startTime:
                    eq_class.append(StartTimeRestriction(Extent.SOME, lit))
                if ref == PROV.endTime:
                    eq_class.append(EndTimeRestriction(Extent.SOME, lit))

    root.equivalent_class = eq_class
    return root.to_graph()


@policies_api.route('/', methods=['POST'])
def create_policy():
    data = request.json
    graph, root = build_policy(source=data['source'],
                               id=data['id'],
                               label=data['label'],
                               definition=data['definition'],
                               action=data['action'],
                               precedence=data['precedence'],
                               activity_restrictions=data['activityRestrictions'],
                               agent_restrictions=data['agentRestrictions'],
                               effects=data['effects'],
                               obligations=data['obligations'])

    pol = graph.serialize(format='turtle').decode('utf-8')
    current_app.logger.info(f'Generated policy {root}')

    pub = Nanopublication.parse_assertions(data=pol, format="turtle")
    current_app.store.put_nanopublication(pub)
    return root


@policies_api.route('/')
def get_policy():
    uri = request.args.get('uri')
    fmt = request.args.get('format', 'turtle')

    result = get_policy_by_uri(uri)

    graph = graph_factory()
    for triple in result:
        graph.add(triple)

    if fmt == 'json-ld':
        policy = json.loads(
            graph.serialize(format='json-ld',
                            context={
                                "owl": "http://www.w3.org/2002/07/owl#",
                                "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                                "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
                                "sio": "http://semanticscience.org/resource/",
                                "xsd": "http://www.w3.org/2001/XMLSchema#"
                            }).decode('utf-8'))
        return jsonify(policy)

    policy = graph.serialize(format=fmt).decode('utf-8')
    return policy


@policies_api.route('/visualization')
def visualize_policy():
    uri = request.args.get('uri')

    result = get_policy_by_uri(uri)

    graph = graph_factory()
    for triple in result:
        graph.add(triple)

    # todo: explore tree to make graphable set
    unprocessed_nodes = set()
    links = []
    nsm = graph.namespace_manager
    for s, p, o in graph:
        if o.n3(nsm) != 'rdf:nil':
            unprocessed_nodes.add(s.n3(nsm))
            unprocessed_nodes.add(o.n3(nsm))
            link = {'source': s.n3(nsm), 'target': o.n3(nsm)}
            if p.n3(nsm)[0] != '_':
                link['label'] = p.n3(nsm)
            links.append(link)

    nodes = []
    for node_id in unprocessed_nodes:
        node = {'id': node_id}
        if node_id[0] != '_':
            node['label'] = node_id
        else:
            node['label'] = 'owl:Restriction'

        if node_id != 'rdf:nil':
            nodes.append(node)

    return jsonify({'nodes': nodes, 'links': links})
