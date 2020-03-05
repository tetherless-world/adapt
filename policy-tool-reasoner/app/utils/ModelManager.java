package utils;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;

public class ModelManager {
    private Map<String, Model> models;

    public ModelManager() {
        models = new HashMap<String, Model>();
    }

    public Model getModel(String key) {
        return models.get(key);
    }

    public Model merge() {
        Model model = ModelFactory.createDefaultModel();
        Iterator<String> keys = models.keySet().iterator();
        while (keys.hasNext()) {
            String key = keys.next();
            model = model.union(models.get(key));
        }
        return model;
    }

    public Model read(InputStream is, String key) {
        Model model = ModelFactory.createDefaultModel();
        model.read(is, null, "TTL");
        models.put(key, model);
        return model;
    }

    public Model read(String url, String key) {
        if (models.get(key) == null) {
            Model model = ModelFactory.createDefaultModel();
            model.read(url, "TTL");
            models.put(key, model);
        }
        return get(key);
    }

    public Model read(String url, String key, String format) {
        if (models.get(key) == null) {
            Model model = ModelFactory.createDefaultModel();
            model.read(url, format);
            models.put(key, model);
        }
        return get(key);
    }

    public Model get(String key) {
        return models.get(key);
    }

	public Model add(Model model, String key) {
        models.put(key, model);
        return get(key);
	}
}