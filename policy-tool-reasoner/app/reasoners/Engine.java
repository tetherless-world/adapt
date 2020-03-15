package reasoners;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import javax.inject.Inject;

import com.google.common.collect.ImmutableSet;
import com.typesafe.config.Config;

import org.apache.jena.rdf.model.Model;

import edu.rpi.tw.twks.client.RestTwksClient;
import edu.rpi.tw.twks.client.RestTwksClientConfiguration;
import edu.rpi.tw.twks.uri.Uri;
import utils.AsyncRunner;
import utils.ModelManager;

public class Engine {

    private final Config config;
    private final ModelManager modelManager;
    private final RestTwksClient twksClient;

    @Inject
    public Engine(Config config, ModelManager modelManager) {
        this.config = config;
        this.modelManager = modelManager;
        this.twksClient = new RestTwksClient(
            RestTwksClientConfiguration.builder()
            .setServerBaseUrl(this.config.getString("twks.base_url"))
            .build()
        );
    }

    public List<String> evaluate(List<Model> partitionedModel) {
        List<String> ontologyUriStrings = new ArrayList<>();
        ontologyUriStrings.add("http://purl.org/twc/dsa/policy/builder/");
        final ImmutableSet<Uri> ontologyUris =
            ontologyUriStrings.stream().map(uriString -> Uri.parse(uriString)).collect(ImmutableSet.toImmutableSet());
        Model twksModel = twksClient.getOntologyAssertions(ontologyUris);

        List<CompletableFuture<List<String>>> futures = partitionedModel.stream()
            .map((requestModel) -> AsyncRunner.get(() -> this.reason(twksModel, requestModel)))
            .collect(Collectors.toList());

        return futures.stream()
            .map(CompletableFuture::join)
            .flatMap(Collection::stream)
            .collect(Collectors.toList());
    }

    private List<String> reason(Model twksModel, Model requestModel) {
        long tid = Thread.currentThread().getId();
        System.out.println("Starting reasoning on thread #" + tid);
        ModelManager modelManager = new ModelManager();

        modelManager.add(requestModel, "requests");
        modelManager.add(twksModel, "twks");

        OWL.reason(modelManager.merge());
        return null;
    }
}