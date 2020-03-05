package edu.rpi.tw.policy_tool.policy_tool_models

import org.apache.jena.datatypes.TypeMapper
import org.apache.jena.geosparql.implementation.datatype.WKTDatatype

object Datatypes {
    register()

    def register(): Unit = {
        TypeMapper.getInstance().registerDatatype(WKTDatatype.INSTANCE)
    }
}