import { DatatypeRestriction, Literal, RestrictionNode } from './baseTypes'

export interface BaseHasValueRestriction extends RestrictionNode {
  'owl:onProperty': 'sio:hasValue'
  'owl:someValuesFrom'?: DatatypeRestriction
  'owl:hasValue'?: Literal
}

export interface HasValueRestriction extends BaseHasValueRestriction {
  'owl:onProperty': 'sio:hasValue'
  'owl:someValuesFrom': undefined
  'owl:hasValue': Literal
}

export interface HasMinimalValueRestriction extends BaseHasValueRestriction {
  'owl:someValuesFrom': DatatypeRestriction & {
    '@type': 'rdfs:Datatype'
    'owl:onDatatype': string
    'owl:withRestrictions': [{ 'xsd:minInclusive': Literal }]
  }
  'owl:hasValue': undefined
}

export interface HasMaximalValueRestriction extends BaseHasValueRestriction {
  'owl:someValuesFrom': DatatypeRestriction & {
    '@type': 'rdfs:Datatype'
    'owl:onDatatype': string
    'owl:withRestrictions': [{ 'xsd:maxInclusive': Literal }]
  }
  'owl:hasValue': undefined
}

export type HasBoundedValueRestriction =
  | HasMinimalValueRestriction
  | HasMaximalValueRestriction
