import { IntersectionClass, NamedNode, RestrictionNode } from './baseTypes'
import { UnitRestriction } from './unit'
import {
  BaseHasValueRestriction,
  HasMaximalValueRestriction,
  HasMinimalValueRestriction,
  HasValueRestriction,
} from './value'

export interface BaseAttributeRestriction extends RestrictionNode {
  'owl:onProperty': 'sio:hasAttribute'
  'owl:hasValue': undefined
}

export interface ClassRestriction extends BaseAttributeRestriction {
  'owl:someValuesFrom':
    | NamedNode
    | (IntersectionClass & { 'owl:intersectionOf': [NamedNode, NamedNode] })
}

export interface AttributeRestriction extends BaseAttributeRestriction {
  'owl:someValuesFrom': IntersectionClass & {
    'owl:intersectionOf': [NamedNode, ...BaseAttributeRestriction[]]
  }
}

export interface BaseValueRestriction extends BaseAttributeRestriction {
  'owl:someValuesFrom': IntersectionClass & {
    'owl:intersectionOf':
      | [NamedNode, BaseHasValueRestriction]
      | [NamedNode, BaseHasValueRestriction, UnitRestriction]
  }
}

export interface ValueRestriction extends BaseValueRestriction {
  'owl:someValuesFrom': IntersectionClass & {
    'owl:intersectionOf':
      | [NamedNode, HasValueRestriction]
      | [NamedNode, HasValueRestriction, UnitRestriction]
  }
}

export interface MinimalValueRestriction extends BaseValueRestriction {
  'owl:someValuesFrom': IntersectionClass & {
    'owl:intersectionOf':
      | [NamedNode, HasMinimalValueRestriction]
      | [NamedNode, HasMinimalValueRestriction, UnitRestriction]
  }
}

export interface MaximalValueRestriction extends BaseValueRestriction {
  'owl:someValuesFrom': IntersectionClass & {
    'owl:intersectionOf':
      | [NamedNode, HasMaximalValueRestriction]
      | [NamedNode, HasMaximalValueRestriction, UnitRestriction]
  }
}

export interface IntervalRestriction extends AttributeRestriction {
  'owl:someValuesFrom': IntersectionClass & {
    'owl:intersectionOf': [
      NamedNode,
      MinimalValueRestriction,
      MaximalValueRestriction
    ]
  }
}

export type BoundedValueRestriction =
  | MinimalValueRestriction
  | MaximalValueRestriction
