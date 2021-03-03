package edu.rpi.tw.adapt.adapt_models

import org.apache.jena.datatypes.TypeMapper
import org.apache.jena.geosparql.implementation.datatype.WKTDatatype

object Datatypes {
    register()

    def register(): Unit = {
        TypeMapper.getInstance().registerDatatype(WKTDatatype.INSTANCE)
    }
}