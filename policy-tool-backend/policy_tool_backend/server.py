# policy-tool-backend/app.py
import glob
import json
import logging
import os
import pathlib
from collections import defaultdict
from operator import itemgetter
from typing import List

import rdflib
from flask import Flask, jsonify, request
from rdflib import BNode, Graph, Literal, URIRef
from twks.client import TwksClient
from twks.nanopub import Nanopublication

from .models.dtos import RequestPostDTO
from .rdf.classes import (AgentRestriction, AttributeRestriction, BooleanClass,
                          Class, EndTimeRestriction, Extent, Graphable,
                          RestrictedDatatype, StartTimeRestriction,
                          ValueRestriction)
from .rdf.common import (OWL, POL, PROV, RDF, RDFS, REQ, SIO, SKOS, XSD,
                         graph_factory)
from .wrappers import TwksClientWrapper

# ==============================================================================
# SETUP
# ==============================================================================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def app_factory(config):
    app = Flask(__name__)
    app.config.from_object(config)

    def default(self, o):
        try:
            s = str(o)
        except TypeError:
            pass
        else:
            return s
        return json.JSONEncoder.default(self, o)

    app.json_encoder.default = default

    api_url = app.config['API_URL']
    twks = TwksClientWrapper(server_base_url=app.config['TWKS_URL'])

    @app.before_first_request
    def load_ontologies():
        twks.load_ontologies(app.config['ONTOLOGY_PATH'])

    @app.route('/')
    def index():
        return 'Hello there!'

    @app.route(f'{api_url}/restrictions', methods=['GET'])
    def get_restrictions():
        results = twks.query_attributes()

        # keep track of important node information
        nodes = defaultdict(lambda: defaultdict(list))
        tree = defaultdict(list)  # keep track of graph structure
        units_map = {}
        for row in results:
            if row.uri not in nodes:
                nodes[row.uri]['uri'] = row.uri
                nodes[row.uri]['label'] = row.label

                # for identifying sio:MaximalValue, sio:MinimalValue, sio:interval
                for sio_uri in [SIO.MaximalValue, SIO.MinimalValue, SIO.interval]:
                    if twks.query_is_subclass(row.uri, sio_uri):
                        nodes[row.uri]['subClassOf'].append(sio_uri)

            if row.property == SIO.hasAttribute:
                tree[row.uri].append(row.range)

            if row.property == SIO.hasValue or row.property == RDF.type:
                nodes[row.uri]['type'] = row.range
                nodes[row.uri]['values'].append({
                    'value': None,
                    'type': row.range
                })

            if row.property == SIO.hasUnit:
                nodes[row.uri]['unit'] = row.range
                nodes[row.uri]['unitLabel'] = row.unitLabel
                # add unit to unit_map
                if row.range not in units_map:
                    subclasses = twks.query_rdfs_subclasses(row.range)
                    units_map[row.range] = [s.asdict() for s in subclasses]

        options_map = {}

        def dfs(node):
            """Depth-first search to create valid restriction structures"""
            if 'values' in node:
                if node['type'] == OWL.Class:
                    subclasses = twks.query_rdfs_subclasses(node['uri'])
                    if not subclasses:
                        # filter restrictions without without options
                        return
                    options_map[node['uri']] = [s.asdict() for s in subclasses]

            if node['uri'] in tree:
                for child in tree[node['uri']]:
                    if child in nodes:
                        child_node = dfs(nodes[child])
                        node['restrictions'].append(child_node)

            return node

        valid_restrictions = [t for node in nodes.values() if (t := dfs(node))]

        return jsonify({
            'validRestrictions': valid_restrictions,
            'optionsMap': options_map,
            'unitsMap': units_map
        })

    # @app.route(f'{api_url}/requestattributes', methods=['GET'])
    # def get_request_attributes():
    #     logging.info('Getting request attributes')

    #     attributes = get_attributes()

    #     response_data = json.loads(attributes.get_data())

    #     response_data['attributes'].append(prov.Action)
    #     response_data['options'][prov.Action['@id']] = get_actions()

    #     return jsonify({
    #         'attributes': response_data['attributes'],
    #         'options': response_data['options']
    #     })

    @app.route(f'{api_url}/actions', methods=['GET'])
    def get_actions():
        results = twks.query_rdf_type(PROV.Activity)
        return jsonify([row.asdict() for row in results])

    @app.route(f'{api_url}/precedences', methods=['GET'])
    def get_precedences():
        results = twks.query_rdfs_subclasses(POL.Precedence)
        return jsonify([row.asdict() for row in results])

    @app.route(f'{api_url}/effects', methods=['GET'])
    def get_effects():
        results = twks.query_rdf_type(POL.Effect)
        return jsonify([row.asdict() for row in results])

    @app.route(f'{api_url}/obligations', methods=['GET'])
    def get_obligations():
        results = twks.query_rdf_type(POL.Obligation)
        return jsonify([row.asdict() for row in results])

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

        identifier = f'{source}#{id}' if source else f'http://purl.org/twc/policy#{id}'

        def dfs(r: dict) -> Graphable:
            uri = URIRef(r['uri'])
            range_ = BooleanClass(OWL.intersectionOf, [uri])
            if r.get('restrictions'):
                children = [dfs(c) for c in r['restrictions']]
                range_.extend(children)
                return AttributeRestriction(Extent.SOME, range_)

            if r.get('values'):
                v, t = [r['values'][0][k] for k in ['value', 'type']]
                if t == OWL.Class:
                    range_.append(AttributeRestriction(Extent.SOME, URIRef(v)))
                else:
                    constraints = []
                    literal = Literal(v, datatype=t)
                    if 'subClassOf' in r:
                        subclasses = [URIRef(s) for s in r['subClassOf']]

                        if SIO.MinimalValue in subclasses:
                            constraints.append((XSD.minInclusive, literal))
                        if SIO.MaximalValue in subclasses:
                            constraints.append((XSD.maxInclusive, literal))

                    if constraints:
                        range_.append(ValueRestriction(Extent.VALUE, literal))
                    else:
                        range_.append(ValueRestriction(Extent.SOME,
                                                       RestrictedDatatype(t, constraints)))

                return AttributeRestriction(Extent.SOME, range_)
            else:
                raise RuntimeError('Invalid attribute structure.')

        eq_agent = AgentRestriction(Extent.SOME,
                                    BooleanClass(OWL.intersectionOf,
                                                 [dfs(a) for a in agent_restrictions]))
        eq_class = BooleanClass(OWL.intersectionOf, [URIRef(action), eq_agent])

        for r in activity_restrictions:
            ref = URIRef(r['uri'])
            v, t = [r['values'][0][k] for k in ['value', 'type']]

            if ref == PROV.Agent:
                eq_class.append(AgentRestriction(Extent.SOME, URIRef(v)))
            else:
                literal = Literal(v, datatype=t)
                if ref == PROV.startTime:
                    eq_class.append(StartTimeRestriction(Extent.SOME, literal))
                if ref == PROV.endTime:
                    eq_class.append(EndTimeRestriction(Extent.SOME, literal))

        root = Class(identifier=URIRef(identifier),
                     label=label,
                     equivalent_class=eq_class,
                     subclass_of=[URIRef(action), URIRef(precedence)])

        graph, _ = root.to_graph()
        return graph

    @ app.route(f'{api_url}/policies', methods=['POST'])
    def create_policy():
        data = request.json
        graph = build_policy(data['source'],
                             data['id'],
                             data['label'],
                             data['definition'],
                             data['action'],
                             data['precedence'],
                             data['activityRestrictions'],
                             data['agentRestrictions'],
                             data['effects'],
                             data['obligations'])

        pol = graph.serialize(format='turtle').decode('utf-8')

        nanopublication = Nanopublication.parse_assertions(data=pol,
                                                           format="turtle")
        twks.save(nanopublication)

        return pol

    return app
