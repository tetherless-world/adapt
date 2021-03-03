def to_option(result):
    return {'label': result.label, 'value': result.uri}

def to_option_list(results):
    return [to_option(r) for r in results]
