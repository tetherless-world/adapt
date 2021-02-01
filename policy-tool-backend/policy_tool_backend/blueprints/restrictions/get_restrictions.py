from collections import defaultdict

from flask import Blueprint, current_app, jsonify
from rdflib import OWL, RDF, RDFS

from ...common import SIO
from ...common.queries import ask_is_subclass, get_subclasses_by_super_class
from .restrictions_blueprint import restrictions_blueprint

attributes_query = '''
SELECT DISTINCT ?uri ?label ?property ?range ?propertyType ?extent ?cardinality ?unitLabel
WHERE {
    ?uri rdfs:label ?label;
            rdfs:subClassOf+ sio:Attribute;
            (rdfs:subClassOf|owl:equivalentClass|(owl:intersectionOf/rdf:rest*/rdf:first))* ?superClass.
    {
        ?superClass owl:onProperty ?property;
                    owl:someValuesFrom|owl:allValuesFrom ?range;
                    ?extent ?range .
        optional { ?property rdf:type ?propertyType }
        optional {
            ?superClass owl:onProperty sio:hasUnit .
            ?range rdfs:label ?unitLabel .
        }
    } UNION {
        ?superClass owl:onDataRange ?range;
                    owl:onProperty ?property;
                    owl:minQualifiedCardinality|owl:maxQualifiedCardinality|owl:qualifiedCardinality ?cardinality;
                    ?extent ?cardinality .
        bind(owl:DatatypeProperty as ?propertyType)
    } UNION {
        ?superClass owl:onClass ?range;
                    owl:onProperty ?property;
                    owl:minQualifiedCardinality|owl:maxQualifiedCardinality|owl:qualifiedCardinality ?cardinality;
                    ?extent ?cardinality .
        bind(owl:ObjectProperty as ?propertyType)
    } UNION {
        ?superClass owl:onProperty ?property;
                    owl:minCardinality|owl:maxCardinality|owl:exactCardinality ?cardinality;
                    ?extent ?cardinality.
        optional { ?property rdf:type ?propertyType }
    } UNION {
        ?property rdfs:domain ?superClass;
                  rdfs:range ?range .
        optional { ?property rdf:type ?propertyType }
    }
}
'''


@restrictions_blueprint.route('')
def get_restrictions():
    results = current_app.store.query_assertions(
        attributes_query,
        initNs={'rdf': RDF, 'rdfs': RDFS, 'sio': SIO, 'owl': OWL})

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
                if ask_is_subclass(row.uri, sio_uri):
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
                subclasses = get_subclasses_by_super_class(row.range)
                units_map[row.range] = [{'value': s.subclass, 'label': s.label}
                                        for s in subclasses]

    options_map = {}

    def dfs(node):
        """Depth-first search to create valid restriction structures"""
        if 'values' in node:
            if node['type'] == OWL.Class:
                subclasses = get_subclasses_by_super_class(node['uri'])
                if not subclasses:
                    # filter restrictions without without options
                    return
                options_map[node['uri']] = [{'value': s.subclass, 'label': s.label}
                                            for s in subclasses]

        if node['uri'] in tree:
            for child in tree[node['uri']]:
                if child in nodes:
                    child_node = dfs(nodes[child])
                    node['restrictions'].append(child_node)

        return node

    restrictions = [t for node in nodes.values() if (t := dfs(node))]

    return jsonify({
        'validRestrictions': restrictions,
        'optionsMap': options_map,
        'unitsMap': units_map
    })
