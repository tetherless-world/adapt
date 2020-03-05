package edu.rpi.tw.policy_tool.policy_tool_models.common

import java.time.{Instant, ZoneId, ZonedDateTime}
import java.util.{Calendar, Date, GregorianCalendar, TimeZone}

import edu.rpi.tw.policy_tool.policy_tool_models.Datatypes
import edu.rpi.tw.policy_tool.policy_tool_models.vocabulary.{PROV, SIO, UO, Vocabularies}
import org.apache.jena.datatypes.TypeMapper
import org.apache.jena.datatypes.xsd.XSDDateTime
import org.apache.jena.geosparql.implementation.datatype.WKTDatatype
import org.apache.jena.geosparql.implementation.vocabulary.GeoSPARQL_URI
import org.apache.jena.rdf.model.{Literal, Model, ModelFactory}
import org.apache.jena.sparql.function.library.date
import org.apache.jena.vocabulary.{OWL, RDF, RDFS, XSD}

abstract class ThingToRdfMapper {
    val model = ModelFactory.createDefaultModel()
    Datatypes.register()
    Vocabularies.addNsPrefixes(model)

    protected def createXsdDateTimeLiteral(zonedDateTime: ZonedDateTime): Literal =
        model.createTypedLiteral(new XSDDateTime(GregorianCalendar.from(zonedDateTime)))
}