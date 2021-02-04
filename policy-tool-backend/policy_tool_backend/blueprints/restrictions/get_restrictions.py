import os
from collections import defaultdict
from copy import deepcopy

from flask import Blueprint, current_app, jsonify
from rdflib import OWL, RDF, RDFS, XSD, PROV

from ...common import SIO
from ...common.queries import ask_is_subclass, get_subclasses_by_superclass
from .error import RestrictionMappingError
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

property_order_map = {
    SIO.hasAttribute: 0,
    RDF.type: 1,
    SIO.hasValue: 2,
    SIO.hasUnit: 3,
}


def property_order(property_uri):
    if property_uri in property_order_map:
        return property_order_map[property_uri]
    return 4


# TODO: restructure for testing
if os.getenv('DEBUG'):
    @restrictions_blueprint.route('/test')
    def get_restrictions_test():
        results = current_app.store.query_assertions(
            attributes_query,
            initNs={'rdf': RDF, 'rdfs': RDFS, 'sio': SIO, 'owl': OWL})
        return jsonify([r.asdict() for r in results])


@restrictions_blueprint.route('')
def get_restrictions():
    results = current_app.store.query_assertions(
        attributes_query,
        initNs={'rdf': RDF, 'rdfs': RDFS, 'sio': SIO, 'owl': OWL})

    rows_by_uri = defaultdict(list)
    # group and sort rows
    for row in results:
        rows_by_uri[row.uri].append(row)
    for uri in rows_by_uri:
        rows_by_uri[uri].sort(key=lambda row: property_order(row.property))

    graph_by_uri = {}
    sio_class_by_uri = {}
    subclasses_by_superclass = {}
    label_by_uri = {}

    def add_subclasses_by_superclass(uri):
        if uri in subclasses_by_superclass:
            return

        subclasses_by_superclass[uri] = []
        subclasses = get_subclasses_by_superclass(uri)
        for s in subclasses:
            subclasses_by_superclass[uri].append(s.subclass)
            if s.subclass not in label_by_uri:
                label_by_uri[s.subclass] = s.label

    def dfs(uri):
        if uri in graph_by_uri:
            return deepcopy(graph_by_uri[uri])

        node = {
            '@type': OWL.Restriction,
            OWL.onProperty: {'@id': SIO.hasAttribute},
            OWL.someValuesFrom: {
                '@type': OWL.Class,
                OWL.intersectionOf: [
                    {'@id': uri}
                ]
            }
        }

        for row in rows_by_uri[uri]:
            if uri not in label_by_uri:
                label_by_uri[uri] = row.label

            if row.property == RDF.type:
                add_subclasses_by_superclass(uri)
                if subclasses_by_superclass[uri]:
                    (node[OWL.someValuesFrom][OWL.intersectionOf]
                        .append({'@id': None}))
                else:
                    node[OWL.someValuesFrom] = {'@id': uri}

            elif row.property == SIO.hasValue:
                if ask_is_subclass(uri, SIO.MinimalValue):
                    sio_class_by_uri[uri] = SIO.MinimalValue
                    (node[OWL.someValuesFrom][OWL.intersectionOf]
                        .append({
                            '@type': OWL.Restriction,
                            OWL.onProperty: {'@id': SIO.hasValue},
                            OWL.someValuesFrom: {
                                '@type': RDFS.Datatype,
                                OWL.onDatatype: row.range,
                                OWL.withRestrictions: [
                                    {
                                        XSD.minInclusive: {
                                            '@type': row.range,
                                            '@value': None
                                        }
                                    }
                                ]
                            }
                        }))
                elif ask_is_subclass(uri, SIO.MaximalValue):
                    sio_class_by_uri[uri] = SIO.MaximalValue
                    (node[OWL.someValuesFrom][OWL.intersectionOf]
                        .append({
                            '@type': OWL.Restriction,
                            OWL.onProperty: {'@id': SIO.hasValue},
                            OWL.someValuesFrom: {
                                '@type': RDFS.Datatype,
                                OWL.onDatatype: row.range,
                                OWL.withRestrictions: [
                                    {
                                        XSD.maxInclusive: {
                                            '@type': row.range,
                                            '@value': None
                                        }
                                    }
                                ]
                            }
                        }))
                else:
                    (node[OWL.someValuesFrom][OWL.intersectionOf]
                        .append({
                            '@type': OWL.Restriction,
                            OWL.onProperty: {'@id': SIO.hasValue},
                            OWL.hasValue: {
                                '@type': row.range,
                                '@value': None
                            }
                        }))

            elif row.property == SIO.hasUnit:
                add_subclasses_by_superclass(row.range)
                if subclasses_by_superclass[row.range]:
                    (node[OWL.someValuesFrom][OWL.intersectionOf]
                        .append({
                            '@type': OWL.Restriction,
                            OWL.onProperty: {'@id': SIO.hasUnit},
                            OWL.someValuesFrom: {
                                '@type': OWL.Class,
                                OWL.intersectionOf: [
                                    {'@id': row.range},
                                    {'@id': None}
                                ]
                            }
                        }))
                else:
                    (node[OWL.someValuesFrom][OWL.intersectionOf]
                        .append({
                            '@type': OWL.Restriction,
                            OWL.onProperty: {'@id': SIO.hasUnit},
                            OWL.someValuesFrom: {'@id': row.range}
                        }))

            elif row.property == SIO.hasAttribute:
                if ask_is_subclass(uri, SIO.interval):
                    sio_class_by_uri[uri] = SIO.interval

                subrest = dfs(row.range)
                if subrest:
                    (node[OWL.someValuesFrom][OWL.intersectionOf]
                        .append(subrest))
            else:
                raise RestrictionMappingError(row.property)

        graph_by_uri[uri] = node
        return deepcopy(node)

    for uri in rows_by_uri:
        graph_by_uri[uri] = dfs(uri)

    for uri in rows_by_uri:
        graph_by_uri[uri] = {
            '@type': OWL.Restriction,
            OWL.onProperty: {'@id': PROV.wasAssociatedWith},
            OWL.someValuesFrom: graph_by_uri[uri]
        }

    return jsonify({
        'validRestrictions': graph_by_uri,
        'subclassesBySuperclass': subclasses_by_superclass,
        'sioClassByURI': sio_class_by_uri,
        'labelByURI': label_by_uri
    })
