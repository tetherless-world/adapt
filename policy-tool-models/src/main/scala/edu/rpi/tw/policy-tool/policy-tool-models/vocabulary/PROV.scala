package edu.rpi.tw.policy_tool.policy_tool_models.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object PROV {
    val PREFIX = "prov"
    val URI = "http://www.w3.org/ns/prov#"

    // Predicates
    val atLocation = ResourceFactory.createProperty(URI + "atLocation")
    val endedAtTime = ResourceFactory.createProperty(URI + "endedAtTime")
    val startedAtTime = ResourceFactory.createProperty(URI + "startedAtTime")
    val wasAssociatedWith = ResourceFactory.createProperty(URI + "wasAssociatedWith")

    // Resources
    val Location = ResourceFactory.createResource(URI + "Location")
}