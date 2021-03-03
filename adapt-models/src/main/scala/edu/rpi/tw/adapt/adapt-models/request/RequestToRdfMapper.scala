package edu.rpi.tw.adapt.adapt_models.request

import java.util.{Calendar, Date, TimeZone}

import edu.rpi.tw.adapt.adapt_models.common.ThingToRdfMapper
import edu.rpi.tw.adapt.adapt_models.vocabulary.{DSA, REQUEST, PROV, SIO, UO}
import org.apache.jena.datatypes.xsd.XSDDateTime
import org.apache.jena.geosparql.implementation.WKTLiteralFactory
import org.apache.jena.geosparql.implementation.vocabulary.{Geo, GeoSPARQL_URI}
import org.apache.jena.rdf.model.ResourceFactory
import org.apache.jena.vocabulary.RDF

final class RequestToRdfMapper(request: Request) extends ThingToRdfMapper {
    val resources = new Resources(request.id)

    addRequestStatements()
    addRequestorStatements()

    private def addRequestStatements(): Unit = {
        resources.request.addProperty(RDF.`type`, DSA.Transmit)
        if (request.dateRange.isDefined) {
            resources.request.addProperty(PROV.startedAtTime, createXsdDateTimeLiteral(request.dateRange.get.from))
            resources.request.addProperty(PROV.endedAtTime, createXsdDateTimeLiteral(request.dateRange.get.until))
        }
        resources.request.addProperty(PROV.wasAssociatedWith, resources.requestor)
    }

    private def addRequestorStatements(): Unit = {
        resources.requestor.addProperty(RDF.`type`, model.createResource(request.agent.id.uri.toString))
        //resources.requestor.addProperty(SIO.hasAttribute, resources.channel)
        //resources.requestor.addProperty(PROV.atLocation, resources.location)
    }

    class Resources(requestId: RequestId) {
        val request = model.createResource(REQUEST.URI + requestId.id)
        val requestor = model.createResource(REQUEST.URI + requestId.id + "_requestor")
    }
}