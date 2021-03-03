export enum XSD {
  // Types
  // -- 'xsd:anyAtomicType' subtypes
  boolean = 'http://www.w3.org/2001/XMLSchema#boolean',
  date = 'http://www.w3.org/2001/XMLSchema#date',
  dateTime = 'http://www.w3.org/2001/XMLSchema#dateTime',
  string = 'http://www.w3.org/2001/XMLSchema#string',
  decimal = 'http://www.w3.org/2001/XMLSchema#decimal',
  float = 'http://www.w3.org/2001/XMLSchema#float',
  time = 'http://www.w3.org/2001/XMLSchema#time',

  // -- 'xsd:decimal' subtypes
  integer = 'http://www.w3.org/2001/XMLSchema#integer',
  int = 'http://www.w3.org/2001/XMLSchema#int',
  nonNegativeInteger = 'http://www.w3.org/2001/XMLSchema#nonNegativeInteger',
  positiveInteger = 'http://www.w3.org/2001/XMLSchema#positiveInteger',
  nonPositiveInteger = 'http://www.w3.org/2001/XMLSchema#nonPositiveInteger',
  negativeInteger = 'http://www.w3.org/2001/XMLSchema#negativeInteger',

  // Facets
  // -- string facets
  length = 'http://www.w3.org/2001/XMLSchema#length',
  maxLength = 'http://www.w3.org/2001/XMLSchema#maxLength',
  minLength = 'http://www.w3.org/2001/XMLSchema#minLength',
  // -- numeric facets
  maxExclusive = 'http://www.w3.org/2001/XMLSchema#maxExclusive',
  maxInclusive = 'http://www.w3.org/2001/XMLSchema#maxInclusive',
  minExclusive = 'http://www.w3.org/2001/XMLSchema#minExclusive',
  minInclusive = 'http://www.w3.org/2001/XMLSchema#minInclusive',
}
