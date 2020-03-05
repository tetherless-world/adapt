package edu.rpi.tw.policy_tool.policy_tool_models.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object UO {
    val PREFIX = "uo"
    val URI = "http://purl.obolibrary.org/obo/UO_"

    // Resources
    val UNIT_0000105 = ResourceFactory.createResource(URI + "0000105")
    val UNIT_0000325 = ResourceFactory.createResource(URI + "0000325")
}