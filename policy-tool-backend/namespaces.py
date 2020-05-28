from rdflib import Graph
from rdflib.namespace import RDF, RDFS, OWL, XSD, SKOS
from rdflib.namespace import Namespace

PROV = Namespace('http://www.w3.org/ns/prov#')
PROV_O = Namespace('http://www.w3.org/ns/prov-o#')
SIO = Namespace('http://semanticscience.org/resource/')
POL = Namespace('http://purl.org/twc/policy/')
DSA_T = Namespace('http://purl.org/twc/policy/example/dsa/')
DSA_POL = Namespace('http://purl.org/twc/policy/example/dsa/policy/')
HEALTH_T = Namespace('http://purl.org/twc/policy/example/healthcare/')
HEALTH_POL = Namespace('http://purl.org/twc/policy/example/healthcare/policy/')


def assign_namespaces(graph: Graph) -> Graph:
    graph.bind('rdf', RDF)
    graph.bind('rdfs', RDFS)
    graph.bind('owl', OWL)
    graph.bind('skos', SKOS)
    graph.bind('xsd', XSD)
    graph.bind('prov', PROV)
    graph.bind('prov-o', PROV_O)
    graph.bind('pol', POL)
    graph.bind('dsa-t', DSA_T)
    graph.bind('dsa-pol', DSA_T)
    graph.bind('health-t', HEALTH_T)
    graph.bind('health-pol', HEALTH_POL)
    return graph
