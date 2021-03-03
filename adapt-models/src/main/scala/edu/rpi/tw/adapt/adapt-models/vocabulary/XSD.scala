package edu.rpi.tw.adapt.adapt_models.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object XSD {
    val URI = org.apache.jena.vocabulary.XSD.getURI()

    // Properties
    val maxInclusive = ResourceFactory.createProperty(URI + "maxInclusive")
    val minInclusive = ResourceFactory.createProperty(URI + "minInclusive")
    val dateTime = ResourceFactory.createProperty(URI + "dateTime")
    val float = ResourceFactory.createProperty(URI + "float")
}