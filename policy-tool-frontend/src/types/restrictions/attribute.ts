import { OWL, SIO } from 'src/namespaces'
import { IntersectionClass, NamedNode, RestrictionNode } from './baseTypes'
import { UnitRestriction } from './unit'
import {
  BaseHasValueRestriction,
  HasMaximalValueRestriction,
  HasMinimalValueRestriction,
  HasValueRestriction,
} from './value'

export interface BaseAttributeRestriction extends RestrictionNode {
  [OWL.onProperty]: SIO.hasAttribute
  [OWL.hasValue]: undefined
}

export interface ClassRestriction extends BaseAttributeRestriction {
  [OWL.someValuesFrom]:
    | NamedNode
    | (IntersectionClass & { [OWL.intersectionOf]: [NamedNode, NamedNode] })
}

export interface AttributeRestriction extends BaseAttributeRestriction {
  [OWL.someValuesFrom]: IntersectionClass & {
    [OWL.intersectionOf]: [NamedNode, ...BaseAttributeRestriction[]]
  }
}

export interface BaseValueRestriction extends BaseAttributeRestriction {
  [OWL.someValuesFrom]: IntersectionClass & {
    [OWL.intersectionOf]:
      | [NamedNode, BaseHasValueRestriction]
      | [NamedNode, BaseHasValueRestriction, UnitRestriction]
  }
}

export interface ValueRestriction extends BaseValueRestriction {
  [OWL.someValuesFrom]: IntersectionClass & {
    [OWL.intersectionOf]:
      | [NamedNode, HasValueRestriction]
      | [NamedNode, HasValueRestriction, UnitRestriction]
  }
}

export interface MinimalValueRestriction extends BaseValueRestriction {
  [OWL.someValuesFrom]: IntersectionClass & {
    [OWL.intersectionOf]:
      | [NamedNode, HasMinimalValueRestriction]
      | [NamedNode, HasMinimalValueRestriction, UnitRestriction]
  }
}

export interface MaximalValueRestriction extends BaseValueRestriction {
  [OWL.someValuesFrom]: IntersectionClass & {
    [OWL.intersectionOf]:
      | [NamedNode, HasMaximalValueRestriction]
      | [NamedNode, HasMaximalValueRestriction, UnitRestriction]
  }
}

export interface IntervalRestriction extends AttributeRestriction {
  [OWL.someValuesFrom]: IntersectionClass & {
    [OWL.intersectionOf]: [
      NamedNode,
      MinimalValueRestriction,
      MaximalValueRestriction
    ]
  }
}

export type BoundedValueRestriction =
  | MinimalValueRestriction
  | MaximalValueRestriction
