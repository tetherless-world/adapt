export default function useDefaultValidAttributes() {
  return [
    {
      attributeName: 'Start Time',
      values: [null],
      typeInfo: {
        'http://semanticscience.org/resource/hasUnit':
          'http://www.w3.org/2001/XMLSchema#dateTime'
      }
    },
    {
      attributeName: 'End Time',
      values: [null],
      typeInfo: {
        'http://semanticscience.org/resource/hasUnit':
          'http://www.w3.org/2001/XMLSchema#dateTime'
      }
    }
  ]
}
