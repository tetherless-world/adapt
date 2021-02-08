import { DatatypeRestriction, RestrictionNode } from './baseTypes'

export interface StartTimeRestriction extends RestrictionNode {
  'owl:onProperty': 'prov:startedAtTime'
  'owl:someValuesFrom': DatatypeRestriction & {
    '@type': 'rdfs:Datatype'
    'owl:onDatatype': 'xsd:dateTime'
    'owl:withRestrictions': [
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
  'owl:onProperty': 'prov:endedAtTime'
  'owl:someValuesFrom': DatatypeRestriction & {
    '@type': 'rdfs:Datatype'
    'owl:onDatatype': 'xsd:dateTime'
    'owl:withRestrictions': [
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
