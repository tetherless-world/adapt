const typeMap = {
  boolean: {
    type: 'boolean',
  },
  Class: {
    type: 'select',
  },
  string: {
    type: 'text',
  },
  decimal: {
    type: 'number',
  },
  float: {
    type: 'number',
  },
  dateTime: {
    type: 'datetime-local',
  },
  date: {
    type: 'date',
  },
  time: {
    type: 'time',
  },
}

export default function getInput(type_uri = '') {
  return typeMap[type_uri.split('#').pop()]?.type
}
