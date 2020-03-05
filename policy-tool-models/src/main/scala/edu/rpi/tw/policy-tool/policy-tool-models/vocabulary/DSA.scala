package edu.rpi.tw.policy_tool.policy_tool_models.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object DSA {
    val PREFIX = "dsa"
    val URI = "http://purl.org/twc/policy/example/dsa/"

    // Resources
    val Transmit = ResourceFactory.createResource(URI + "Transmit")
}