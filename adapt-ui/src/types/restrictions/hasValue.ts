import { OWL, SIO, XSD } from 'src/namespaces'
import { XOR } from 'ts-xor'
import { Literal, NamedNode } from '../base'
import { DatatypeRestriction, Restriction } from './common'

export interface HasValueRestriction extends Restriction {
  [OWL.onProperty]: NamedNode & { '@id': SIO.hasValue }
  [OWL.someValuesFrom]: never
  [OWL.hasValue]: Literal
}

export interface HasMinimalValueRestriction extends Restriction {
  [OWL.onProperty]: NamedNode & { '@id': SIO.hasValue }
  [OWL.hasValue]: never
  [OWL.someValuesFrom]: DatatypeRestriction & {
    [OWL.onDatatype]: NamedNode
    [OWL.withRestrictions]: [{ [XSD.minInclusive]: Literal }]
  }
}

export interface HasMaximalValueRestriction extends Restriction {
  [OWL.onProperty]: NamedNode & { '@id': SIO.hasValue }
  [OWL.hasValue]: never
  [OWL.someValuesFrom]: DatatypeRestriction & {
    [OWL.onDatatype]: NamedNode
    [OWL.withRestrictions]: [{ [XSD.maxInclusive]: Literal }]
  }
}

export type HasBoundedValueRestriction = XOR<
  HasMinimalValueRestriction,
  HasMaximalValueRestriction
>
export type DisjointHasValueRestriction = XOR<
  HasValueRestriction,
  HasBoundedValueRestriction
>
