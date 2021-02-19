import { OWL } from 'src/namespaces'
import { DatatypeRestriction, RestrictionNode } from './baseTypes'

export interface StartTimeRestriction extends RestrictionNode {
  [OWL.onProperty]: 'prov:startedAtTime'
  [OWL.someValuesFrom]: DatatypeRestriction & {
    '@type': 'rdfs:Datatype'
    [OWL.onDatatype]: 'xsd:dateTime'
    [OWL.withRestrictions]: [
      {
        'xsd:minInclusive': {
          '@type': 'xsd:dateTime'
          value: string
        }
      }
    ]
  }
}

export interface EndTimeRestriction extends RestrictionNode {
  [OWL.onProperty]: 'prov:endedAtTime'
  [OWL.someValuesFrom]: DatatypeRestriction & {
    '@type': 'rdfs:Datatype'
    [OWL.onDatatype]: 'xsd:dateTime'
    [OWL.withRestrictions]: [
      {
        'xsd:maxInclusive': {
          '@type': 'xsd:dateTime'
          value: string
        }
      }
    ]
  }
}

export type ValidityRestriction = StartTimeRestriction | EndTimeRestriction
