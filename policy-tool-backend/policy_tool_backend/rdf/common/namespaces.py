from rdflib import Graph
from rdflib.namespace import RDF, RDFS, OWL, XSD, SKOS
from rdflib.namespace import Namespace, NamespaceManager

PROV = Namespace('http://www.w3.org/ns/prov#')
SIO = Namespace('http://semanticscience.org/resource/')
POL = Namespace('http://purl.org/twc/policy/')
REQ = Namespace('http://purl.org/twc/request/')
DSA_T = Namespace('http://purl.org/twc/policy/example/dsa/')
DSA_POL = Namespace('http://purl.org/twc/policy/example/dsa/policy/')
HEALTH_T = Namespace('http://purl.org/twc/policy/example/healthcare/')
HEALTH_POL = Namespace('http://purl.org/twc/policy/example/healthcare/policy/')

namespace_manager = NamespaceManager(Graph())

namespace_manager.bind('rdf', RDF)
namespace_manager.bind('rdfs', RDFS)
namespace_manager.bind('owl', OWL)
namespace_manager.bind('skos', SKOS)
namespace_manager.bind('xsd', XSD)
namespace_manager.bind('sio', SIO)
namespace_manager.bind('prov', PROV)
namespace_manager.bind('pol', POL)
namespace_manager.bind('req', REQ)
namespace_manager.bind('dsa-t', DSA_T)
namespace_manager.bind('dsa-pol', DSA_POL)
namespace_manager.bind('health-t', HEALTH_T)
namespace_manager.bind('health-pol', HEALTH_POL)