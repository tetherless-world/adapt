package edu.rpi.tw.adapt.adapt_models

import edu.rpi.tw.adapt.adapt_models.common.ThingToRdfMapper
import edu.rpi.tw.adapt.adapt_models.vocabulary.Vocabularies
import org.apache.jena.rdf.model.Model

abstract class RdfModelSpec extends UnitSpec {

    protected def assertModelEquals(actualModel: Model, expectedModel: Model): Unit = {
        if (actualModel.isIsomorphicWith(expectedModel)) {
            return
        }
        printModelComparison(actualModel, expectedModel)
        fail()
    }

    protected def printModelComparison(actualModel: Model, expectedModel: Model): Unit = {
        val lang = "TURTLE"
        System.out.println("Expected model: ")
        expectedModel.write(System.out, lang)
        System.out.println()
        System.out.println("Actual model: ")
        actualModel.write(System.out, lang)
        System.out.println()
        System.out.println("Differences:")
        val difference = actualModel.difference(expectedModel)
        Vocabularies.addNsPrefixes(difference)
        difference.write(System.out, lang)
    }

  //  private def toString(model: Model): String = {
  //    val writer = new StringWriter()
  //    model.write()
  //  }

}