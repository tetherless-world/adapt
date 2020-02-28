package controllers;

import com.fasterxml.jackson.databind.node.ObjectNode;

import play.libs.Json;
import play.mvc.*;

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
    public Result evaluate() {
        ObjectNode result = Json.newObject();
        result.put("exampleField1", "foobar");
        result.put("exampleField2", "Hello world!");
        return ok(result);
    }

}
