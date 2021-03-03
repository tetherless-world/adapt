package edu.rpi.tw.adapt.adapt_models.dsa_models;

import edu.rpi.tw.adapt.adapt_models.common.Agent;
import edu.rpi.tw.adapt.adapt_models.common.AgentId;
import edu.rpi.tw.adapt.adapt_models.request.Request;
import edu.rpi.tw.adapt.adapt_models.request.RequestDateRange;
import edu.rpi.tw.adapt.adapt_models.request.RequestId;
import edu.rpi.tw.adapt.adapt_models.request.RequestToRdfMapper;
import io.lemonlabs.uri.Uri;
import io.lemonlabs.uri.config.UriConfig;
import junit.framework.TestCase;
import org.junit.Test;
import scala.Option;
import scala.math.BigDecimal;
import org.apache.jena.rdf.model.Model;

import java.time.ZonedDateTime;
import java.util.Date;

public final class JavaInterfaceTest extends TestCase {
    @Test
    public void testRequest() {
        final ZonedDateTime requestFromDate = ZonedDateTime.now();
        // Use Option.apply(null) for missing
        final Request request =
                new Request(
                        Option.apply(new RequestDateRange(requestFromDate, requestFromDate.plusMinutes(1))),
                        RequestId.apply("testRequest"),
                        new Agent(AgentId.apply(Uri.parse("http://example.com/ExampleRadio", UriConfig.conservative())))
                );
        Model model = new RequestToRdfMapper(request).model();
        model.write(System.out, "TTL");
    }
}