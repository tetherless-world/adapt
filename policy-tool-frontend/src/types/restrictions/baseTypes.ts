export interface NamedNode {
  '@id': string | null
}

export interface Literal {
  '@type': string
  '@value': string | number | null
}

export interface DatatypeRestriction {
  '@type': 'rdfs:Datatype'
  'owl:onDatatype': string
  'owl:withRestrictions': { [k: string]: Literal }[]
}

export interface RestrictionNode {
  '@type': 'owl:Restriction'
  'owl:onProperty': string
  'owl:someValuesFrom'?:
    | NamedNode
    | RestrictionNode
    | DatatypeRestriction
    | IntersectionClass
  'owl:hasValue'?: NamedNode | Literal
}

export interface IntersectionClass {
  '@type': 'owl:Class'
  'owl:intersectionOf': [NamedNode, ...RestrictionNode[]]
}
