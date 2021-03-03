package controllers;

import java.time.ZonedDateTime;

import com.fasterxml.jackson.databind.JsonNode;

import org.apache.jena.rdf.model.Model;

import edu.rpi.tw.adapt.adapt_models.common.Agent;
import edu.rpi.tw.adapt.adapt_models.common.AgentId;
import edu.rpi.tw.adapt.adapt_models.request.Request;
import edu.rpi.tw.adapt.adapt_models.request.RequestDateRange;
import edu.rpi.tw.adapt.adapt_models.request.RequestId;
import edu.rpi.tw.adapt.adapt_models.request.RequestToRdfMapper;
import io.lemonlabs.uri.Uri;
import io.lemonlabs.uri.config.UriConfig;
import play.mvc.*;

import scala.Option;

/**
 * This controller contains an action to handle HTTP requests
 * to the application's home page.
 */
public class RequestController extends Controller {

    /**
     * An action that renders an HTML page with a welcome message.
     * The configuration in the <code>routes</code> file means that
     * this method will be called when the application receives a
     * <code>GET</code> request with a path of <code>/</code>.
     */
    @BodyParser.Of(BodyParser.Json.class)
    public Result evaluate(Http.Request request) {
        JsonNode json = request.body().asJson();
        final ZonedDateTime requestFromDate = ZonedDateTime.now();
        // Use Option.apply(null) for missing
        final Request requestA =
                new Request(
                        Option.apply(new RequestDateRange(requestFromDate, requestFromDate.plusMinutes(1))),
                        RequestId.apply("testRequest"),
                        new Agent(AgentId.apply(Uri.parse("http://example.com/ExampleRadio", UriConfig.conservative())))
                );
        Model model = new RequestToRdfMapper(requestA).model();
        return ok(json);
    }

}
