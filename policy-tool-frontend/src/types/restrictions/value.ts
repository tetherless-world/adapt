import { OWL, SIO } from 'src/namespaces'
import { DatatypeRestriction, Literal, RestrictionNode } from './baseTypes'

export interface BaseHasValueRestriction extends RestrictionNode {
  [OWL.onProperty]: SIO.hasValue
  [OWL.someValuesFrom]?: DatatypeRestriction
  [OWL.hasValue]?: Literal
}

export interface HasValueRestriction extends BaseHasValueRestriction {
  [OWL.onProperty]: SIO.hasValue
  [OWL.someValuesFrom]: undefined
  [OWL.hasValue]: Literal
}

export interface HasMinimalValueRestriction extends BaseHasValueRestriction {
  [OWL.someValuesFrom]: DatatypeRestriction & {
    '@type': 'rdfs:Datatype'
    [OWL.onDatatype]: string
    [OWL.withRestrictions]: [{ 'xsd:minInclusive': Literal }]
  }
  [OWL.hasValue]: undefined
}

export interface HasMaximalValueRestriction extends BaseHasValueRestriction {
  [OWL.someValuesFrom]: DatatypeRestriction & {
    '@type': 'rdfs:Datatype'
    [OWL.onDatatype]: string
    [OWL.withRestrictions]: [{ 'xsd:maxInclusive': Literal }]
  }
  [OWL.hasValue]: undefined
}

export type HasBoundedValueRestriction =
  | HasMinimalValueRestriction
  | HasMaximalValueRestriction
