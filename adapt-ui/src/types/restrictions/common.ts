import { OWL, RDFS } from 'src/namespaces'
import { Literal, NamedNode, Node, TypedNode } from '../base'

export interface IntersectionOf extends TypedNode {
  '@type': OWL.Class
  [OWL.intersectionOf]: [Node, Node, ...Node[]]
}

export interface UnionOf extends TypedNode {
  '@type': OWL.Class
  [OWL.unionOf]: [Node, Node, ...Node[]]
}

export interface Restriction extends TypedNode {
  '@type': OWL.Restriction
  [OWL.onProperty]: NamedNode
  [OWL.hasValue]?: NamedNode | Literal
  [OWL.someValuesFrom]?:
    | NamedNode
    | TypedNode
    | Restriction
    | DatatypeRestriction
}

export interface DatatypeRestriction extends TypedNode {
  '@type': RDFS.Datatype
  [OWL.onDatatype]: NamedNode
  [OWL.withRestrictions]: [{ [key: string]: Literal }]
}
