export interface Node extends Record<any, any> {}

export interface NamedNode extends Node {
  '@id': string
}

export interface TypedNode {
  '@type': string
}

export interface Literal extends TypedNode {
  '@type': string
  '@value'?: string | number
}
