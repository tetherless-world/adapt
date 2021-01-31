from flask import jsonify, request

from ...rdf.common import graph_factory
from .policies_blueprint import policies_blueprint
from .queries import get_policy_by_uri


@policies_blueprint.route('/visualization')
def get_policy_visualization():
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
