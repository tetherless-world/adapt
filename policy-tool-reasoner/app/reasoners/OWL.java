package reasoners;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Resource;
import org.semanticweb.HermiT.Configuration;
import org.semanticweb.HermiT.ReasonerFactory;
import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.io.StreamDocumentSource;
import org.semanticweb.owlapi.model.MissingImportHandlingStrategy;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.OWLOntologyCreationException;
import org.semanticweb.owlapi.model.OWLOntologyLoaderConfiguration;
import org.semanticweb.owlapi.model.OWLOntologyManager;
import org.semanticweb.owlapi.model.UnloadableImportException;
import org.semanticweb.owlapi.reasoner.FreshEntityPolicy;
import org.semanticweb.owlapi.reasoner.OWLReasoner;
import org.semanticweb.owlapi.util.ShortFormProvider;
import org.semanticweb.owlapi.util.SimpleShortFormProvider;

import utils.Config;

public class OWL {

    public static void reason(Model inputModel) {
        //Map<String, EvaluationResult> results = new HashMap<String, EvaluationResult>();

        OWLOntology model = OWL.convert(inputModel);
        if (model == null) return ;

        Configuration config = new Configuration();
        config.ignoreUnsupportedDatatypes = true;
        config.throwInconsistentOntologyException = false;
        config.bufferChanges = false;
        config.existentialStrategyType = Configuration.ExistentialStrategyType.INDIVIDUAL_REUSE;
        config.blockingSignatureCacheType = Configuration.BlockingSignatureCacheType.NOT_CACHED;
        config.useDisjunctionLearning = false;
        OWLReasoner reasoner = new ReasonerFactory().createReasoner(model, config);
        ShortFormProvider shortFormProvider = new SimpleShortFormProvider();

        DLQueryPrinter dlQueryPrinter = new DLQueryPrinter(new DLQueryEngine(reasoner, shortFormProvider), shortFormProvider);

        String leftAlignFormat = "| %-25s | %-17s | %n";
        String partialLeftAlignFormat1 = "| %-25s ";
        String partialLeftAlignFormat2 = "| %-17s | %n";
        System.out.format("+---------------------------+-------------------+%n");
        System.out.format("|                           | Requests          |%n");
        System.out.format("+---------------------------+-------------------+%n");

        Query query = QueryFactory.create(
            Config.SPARQL_NAMESPACES +
            "SELECT ?activity ?label " +
            "WHERE { " +
            "   ?activity rdf:type policy:Policy . " +
            "   ?activity rdfs:label ?label " +
            "}"
        );
        QueryExecution qexec = QueryExecutionFactory.create(query, inputModel);
        ResultSet rs = qexec.execSelect();

        while (rs.hasNext()) {
            QuerySolution qs = rs.next();
            Resource activity = qs.getResource("activity");
            Literal label = qs.getLiteral("label ");
            String permitted, prohibited;
            boolean first;

            System.out.format("+---------------------------+-------------------+%n");
            System.out.format(leftAlignFormat, activity.getLocalName(), "");
            System.out.format(partialLeftAlignFormat1, activity.getLocalName());

            List<String> classifieds = dlQueryPrinter.askInstancesList(activity.getLocalName());

            Iterator<String> j = classifieds.iterator();
            first = true;
            if (j.hasNext()) {
                while (j.hasNext()) {
                    String classified = j.next();

                    if (first) {
                        System.out.format(partialLeftAlignFormat2, classified);
                        first = false;
                    } else {
                        System.out.format(leftAlignFormat, "", classified);
                    }
                }
            } else {
                System.out.format(partialLeftAlignFormat2, "[NONE]");
            }
        }

        System.out.format("+---------------------------+-------------------+%n");

        // System.out.format("%n");
        // System.out.format("%n");
        // System.out.format("%n");

        // System.out.format("+---------------------------+-------------------+%n");
        // System.out.format(leftAlignFormat, "PermittedActivity", "");
        // List<String> classifieds = dlQueryPrinter.askInstancesList("PermittedActivity");
        // Iterator<String> j = classifieds.iterator();
        // if (j.hasNext()) {
        //     while (j.hasNext()) {
        //         String classified = j.next();
        //         System.out.format(leftAlignFormat, "", classified);
        //     }
        // } else {
        //     System.out.format(leftAlignFormat, "", "[NONE]");
        // }

        // System.out.format("+---------------------------+-------------------+%n");
        // System.out.format(leftAlignFormat, "DeniedActivity", "");
        // classifieds = dlQueryPrinter.askInstancesList("DeniedActivity");
        // j = classifieds.iterator();
        // if (j.hasNext()) {
        //     while (j.hasNext()) {
        //         String classified = j.next();
        //         System.out.format(leftAlignFormat, "", classified);
        //     }
        // } else {
        //     System.out.format(leftAlignFormat, "", "[NONE]");
        // }
        // System.out.format("+---------------------------+-------------------+%n");
        // System.out.println("[][][]finished printing: " + swpprint);

        //Collection<EvaluationResult> values = results.values();
        //ArrayList<EvaluationResult> listOfValues = new ArrayList<EvaluationResult>(values);
        return ;
    }

    public static OWLOntology convert(Model jenaModel) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        OWLOntologyManager manager = OWLManager.createOWLOntologyManager();
        OWLOntologyLoaderConfiguration config = new OWLOntologyLoaderConfiguration();
        config = config.setMissingImportHandlingStrategy(MissingImportHandlingStrategy.SILENT);

        jenaModel.write(out, "TURTLE");
        OWLOntology owlapiModel = null;
        try {
            // = manager.loadOntologyFromOntologyDocument(new ByteArrayInputStream(out.toByteArray()));
            owlapiModel = manager.loadOntologyFromOntologyDocument(new StreamDocumentSource(new ByteArrayInputStream(out.toByteArray())), config);
        } catch (OWLOntologyCreationException e) {
            e.printStackTrace();
        }
        return owlapiModel;
    }
}