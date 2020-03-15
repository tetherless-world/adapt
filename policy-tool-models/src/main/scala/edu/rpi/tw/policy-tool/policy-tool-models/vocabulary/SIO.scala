package edu.rpi.tw.policy_tool.policy_tool_models.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object SIO {
    val PREFIX = "sio"
    val URI = "http://semanticscience.org/resource/"

    // Predicates
    val hasAttribute = ResourceFactory.createProperty(URI + "hasAttribute")
    val hasUnit = ResourceFactory.createProperty(URI + "hasUnit")
    val hasValue = ResourceFactory.createProperty(URI + "hasValue")
}