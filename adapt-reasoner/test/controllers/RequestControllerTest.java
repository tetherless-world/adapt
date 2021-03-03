package controllers;

import org.junit.Test;
import play.Application;
import play.inject.guice.GuiceApplicationBuilder;
import play.mvc.Http;
import play.mvc.Result;
import play.test.WithApplication;

import static org.junit.Assert.assertEquals;
import static play.mvc.Http.Status.OK;
import static play.test.Helpers.GET;
import static play.test.Helpers.route;

import java.io.File;
import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class RequestControllerTest extends WithApplication {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    protected Application provideApplication() {
        return new GuiceApplicationBuilder().build();
    }

    @Test
    public void testEvaluate() throws JsonProcessingException, IOException {
        JsonNode json = mapper.readTree(new File("test-data/requests.json"));
        Http.RequestBuilder request = new Http.RequestBuilder()
                .method(GET)
                .bodyJson(json)
                .uri("/request/evaluate");

        Result result = route(app, request);
        
        assertEquals(OK, result.status());
    }

}
