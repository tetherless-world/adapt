import { OWL } from "src/namespaces";

export interface NamedNode {
  '@id': string | null
}

export interface Literal {
  '@type': string
  '@value': string | number | null
}

export interface DatatypeRestriction {
  '@type': 'rdfs:Datatype'
  [OWL.onDatatype]: string
  [OWL.withRestrictions]: { [k: string]: Literal }[]
}

export interface RestrictionNode {
  '@type': OWL.Restriction
  [OWL.onProperty]: string
  [OWL.someValuesFrom]?:
    | NamedNode
    | RestrictionNode
    | DatatypeRestriction
    | IntersectionClass
  [OWL.hasValue]?: NamedNode | Literal
}

export interface IntersectionClass {
  '@type': OWL.Class
  [OWL.intersectionOf]: [NamedNode, ...RestrictionNode[]]
}
