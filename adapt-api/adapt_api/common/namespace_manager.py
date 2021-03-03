from rdflib import OWL, PROV, RDF, RDFS, SKOS, XSD, Graph
from rdflib.namespace import NamespaceManager

from .namespaces import DSA_T, HEALTH_T, POL, REQ, SIO

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
namespace_manager.bind('health-t', HEALTH_T)
