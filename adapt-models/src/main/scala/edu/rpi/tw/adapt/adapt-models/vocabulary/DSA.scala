package edu.rpi.tw.adapt.adapt_models.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object DSA {
    val PREFIX = "dsa"
    val URI = "http://purl.org/twc/policy/example/dsa/"

    // Resources
    val Transmit = ResourceFactory.createResource(URI + "Transmit")
}