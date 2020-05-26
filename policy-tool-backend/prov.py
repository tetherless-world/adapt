startTime = {
    '@id': 'http://www.w3.org/ns/prov#startTime',
    'label': 'Start time',
    'default': {
        '@id': 'http://www.w3.org/ns/prov#startTime',
        'label': 'Start time',
        'values': [
            {
                '@type': 'http://www.w3.org/2001/XMLSchema#dateTime',
                '@value': None
            }
        ]
    }
}

endTime = {
    '@id': 'http://www.w3.org/ns/prov#endTime',
    'label': 'End time',
    'default': {
        '@id': 'http://www.w3.org/ns/prov#endTime',
        'label': 'End time',
        'values': [
            {
                '@type': 'http://www.w3.org/2001/XMLSchema#dateTime',
                '@value': None
            }
        ]
    }
}

Agent = {
    '@id': 'http://www.w3.org/ns/prov#Agent',
    'label': 'Agent',
    'default': {
        '@id': 'http://www.w3.org/ns/prov#Agent',
        'label': 'Agent',
        'values': [
            {
                '@type': 'http://www.w3.org/2002/07/owl#Class',
                '@value': None
            }
        ]
    }
}
