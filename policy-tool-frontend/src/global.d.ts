import { SignKeyObjectInput } from 'crypto'
import { Dictionary, PropertyName, PropertyPath } from 'lodash'

export interface Restriction {
  uri: string
  label: string
  restrictions?: Restriction[]
  values?: Value[]
  subClassOf?: string[]
  unit?: string
  unitLabel?: string
  type?: string
}

export type Option = {
  value: any
  label: string
}

export type Value = {
  value: any
  type: string
}

export type OptionMap = Dictionary<Option[]>

export interface PolicyState {
  id: string
  source: string
  label: string
  definition: string
  action: string
  precedence: string
  agentRestrictions: Restriction[]
  activityRestrictions: Restriction[]
  effects: Value[]
  obligations: Value[]
}

export interface NewPolicyState {
  // Identifier (source + id)
  '@id': string
  '@type': 'pol:Policy'
  // Label
  'rdfs:label': string
  // Definition
  'skos:definition': string
  // Restrictions
  'owl:equivalentClass': {
    '@type': 'owl:Class'
    'owl:intersectionOf': [
      // Action
      NamedNode,
      // Agent and Attribute restrictions
      ...AgentRestriction[],
      // Validity restrictions
      ...ValidityRestriction[]
    ]
  }
  'rdfs:subClassOf': [
    // Precedence
    NamedNode,
    // Additional Effects
    // TODO: How do we distinguish between effects and obligations here?
    ...NamedNode[]
  ]
}
