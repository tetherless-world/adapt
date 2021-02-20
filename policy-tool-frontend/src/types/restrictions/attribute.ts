import { OWL, SIO } from 'src/namespaces'
import { XOR } from 'ts-xor'
import { NamedNode } from '../base'
import { IntersectionOf, Restriction } from './common'
import {
  DisjointHasValueRestriction,
  HasMaximalValueRestriction,
  HasMinimalValueRestriction,
  HasValueRestriction,
} from './hasValue'
import { UnitRestriction } from './unit'

export interface DisjointValueRestriction extends Restriction {
  [OWL.onProperty]: NamedNode & { '@id': SIO.hasAttribute }
  [OWL.someValuesFrom]: IntersectionOf & {
    [OWL.intersectionOf]: XOR<
      [NamedNode, DisjointHasValueRestriction],
      [NamedNode, DisjointHasValueRestriction, UnitRestriction]
    >
  }
}

export interface ValueRestriction extends DisjointValueRestriction {
  [OWL.someValuesFrom]: IntersectionOf & {
    [OWL.intersectionOf]: XOR<
      [NamedNode, HasValueRestriction],
      [NamedNode, HasValueRestriction, UnitRestriction]
    >
  }
}

export interface MinimalValueRestriction extends DisjointValueRestriction {
  [OWL.someValuesFrom]: IntersectionOf & {
    [OWL.intersectionOf]: XOR<
      [NamedNode, HasMinimalValueRestriction],
      [NamedNode, HasMinimalValueRestriction, UnitRestriction]
    >
  }
}

export interface MaximalValueRestriction extends DisjointValueRestriction {
  [OWL.someValuesFrom]: IntersectionOf & {
    [OWL.intersectionOf]: XOR<
      [NamedNode, HasMaximalValueRestriction],
      [NamedNode, HasMaximalValueRestriction, UnitRestriction]
    >
  }
}

export interface ClassRestriction extends Restriction {
  [OWL.onProperty]: NamedNode & { '@id': SIO.hasAttribute }
  [OWL.someValuesFrom]: XOR<
    NamedNode,
    IntersectionOf & { [OWL.intersectionOf]: [NamedNode, NamedNode] }
  >
}

export interface AttributeRestriction extends Restriction {
  [OWL.onProperty]: NamedNode & { '@id': SIO.hasAttribute }
  [OWL.someValuesFrom]: IntersectionOf & {
    [OWL.intersectionOf]: [NamedNode, Restriction, ...Restriction[]]
  }
}

export interface IntervalRestriction extends AttributeRestriction {
  [OWL.someValuesFrom]: IntersectionOf & {
    [OWL.intersectionOf]: [
      NamedNode,
      MinimalValueRestriction,
      MaximalValueRestriction
    ]
  }
}

export type BoundedValueRestriction = XOR<
  MinimalValueRestriction,
  MaximalValueRestriction
>

export type DisjointAttributeRestriction = XOR<
  ClassRestriction,
  XOR<DisjointValueRestriction, AttributeRestriction>
>
