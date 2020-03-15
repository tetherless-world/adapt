package reasoners;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.semanticweb.owlapi.manchestersyntax.renderer.ParserException;
import org.semanticweb.owlapi.model.OWLClass;
import org.semanticweb.owlapi.model.OWLEntity;
import org.semanticweb.owlapi.model.OWLNamedIndividual;
import org.semanticweb.owlapi.util.ShortFormProvider;

class DLQueryPrinter {
    private final DLQueryEngine dlQueryEngine;
    private final ShortFormProvider shortFormProvider;

    public DLQueryPrinter(DLQueryEngine engine, ShortFormProvider shortFormProvider) {
        this.shortFormProvider = shortFormProvider;
        dlQueryEngine = engine;
    }

    public String askInstances(String classExpression) {
        if (classExpression.length() == 0) {
            return "";
        } else {
            StringBuilder sb = new StringBuilder();
            Set<OWLNamedIndividual> individuals = dlQueryEngine.getInstances(
                classExpression, true);
            printEntitiesTable(individuals, sb);
            return sb.toString();
        }
    }

    public List<String> askInstancesList(String classExpression) {
        List<String> results = new ArrayList<String>();
        if (classExpression.length() != 0) {
            Set<OWLNamedIndividual> individuals = dlQueryEngine.getInstances(
                classExpression, false);
            Iterator<OWLNamedIndividual> i = individuals.iterator();
            while (i.hasNext()) {
                OWLNamedIndividual individual = i.next();
                results.add(shortFormProvider.getShortForm(individual));
            }
        }
        return results;
    }

    public void askQuery(String classExpression) {
        if (classExpression.length() == 0) {
            System.out.println("No class expression specified");
        } else {
            try {
                StringBuilder sb = new StringBuilder();
                sb.append("\nQUERY:   ").append(classExpression).append("\n\n");
                Set<OWLClass> superClasses = dlQueryEngine.getSuperClasses(
                        classExpression, false);
                printEntities("SuperClasses", superClasses, sb);
                Set<OWLClass> equivalentClasses = dlQueryEngine
                        .getEquivalentClasses(classExpression);
                printEntities("EquivalentClasses", equivalentClasses, sb);
                Set<OWLClass> subClasses = dlQueryEngine.getSubClasses(classExpression,
                        true);
                printEntities("SubClasses", subClasses, sb);
                Set<OWLNamedIndividual> individuals = dlQueryEngine.getInstances(
                        classExpression, false);
                printEntities("Instances", individuals, sb);
                System.out.println(sb.toString());
            } catch (ParserException e) {
                System.out.println(e.getMessage());
            }
        }
    }

    private void printEntities(String name, Set<? extends OWLEntity> entities, StringBuilder sb) {
        sb.append(name);
        int length = 50 - name.length();
        for (int i = 0; i < length; i++) {
            sb.append(".");
        }
        sb.append("\n\n");
        if (!entities.isEmpty()) {
            for (OWLEntity entity : entities) {
                sb.append("\t").append(shortFormProvider.getShortForm(entity))
                        .append("\n");
            }
        } else {
            sb.append("\t[NONE]\n");
        }
        sb.append("\n");
    }

    private void printEntitiesTable(Set<? extends OWLEntity> entities, StringBuilder sb) {
        if (!entities.isEmpty()) {
            for (OWLEntity entity : entities) {
                sb.append(shortFormProvider.getShortForm(entity))
                    .append(";");
            }
        } else {
            sb.append("[NONE]");
        }
    }
}