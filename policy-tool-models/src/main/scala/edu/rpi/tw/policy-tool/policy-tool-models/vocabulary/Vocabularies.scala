package edu.rpi.tw.policy_tool.policy_tool_models.vocabulary

import org.apache.jena.geosparql.implementation.vocabulary.GeoSPARQL_URI
import org.apache.jena.rdf.model.Model
import org.apache.jena.vocabulary.{OWL, RDF, RDFS, SKOS, XSD}

object Vocabularies {
    def addNsPrefixes(model: Model): Unit = {
        model.setNsPrefix("geo", GeoSPARQL_URI.GEO_URI)
        model.setNsPrefix("owl", OWL.getURI)
        model.setNsPrefix(PROV.PREFIX, PROV.URI)
        model.setNsPrefix("rdf", RDF.getURI)
        model.setNsPrefix("rdfs", RDFS.getURI)
        model.setNsPrefix("sf", GeoSPARQL_URI.SF_URI)
        model.setNsPrefix("skos", SKOS.getURI)
        model.setNsPrefix(SIO.PREFIX, SIO.URI)
        model.setNsPrefix(UO.PREFIX, UO.URI)
        model.setNsPrefix("xsd", org.apache.jena.vocabulary.XSD.getURI)
    }
}