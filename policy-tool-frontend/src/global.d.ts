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

export interface NamedNode {
  '@id': string | null
}

export interface Literal {
  '@type': string
  '@value': any
}

export interface DatatypeRestriction {
  '@type': 'rdfs:Datatype'
  'owl:onDatatype': string
  'owl:withRestrictions': { [k: string]: Literal }[]
}

// TODO: rename to restriction
export interface RestrictionNode {
  '@type': 'owl:Restriction'
  'owl:onProperty': string
  'owl:someValuesFrom': NamedNode | IntersectionClass
}

export interface IntersectionClass {
  '@type': 'owl:Class'
  'owl:intersectionOf': [NamedNode, ...RestrictionNode[]]
}

export interface BaseHasValueRestriction extends RestrictionNode {
  'owl:onProperty': 'sio:hasValue'
  'owl:someValuesFrom': DatatypeRestriction | never
  'owl:hasValue': Literal | never
}

export interface HasValueRestriction extends BaseHasValueRestriction {
  'owl:onProperty': 'sio:hasValue'
  'owl:someValuesFrom': never
  'owl:hasValue': Literal
}

export interface HasMinimalValueRestriction extends BaseHasValueRestriction {
  'owl:someValuesFrom': DatatypeRestriction & {
    '@type': 'rdfs:Datatype'
    'owl:onDatatype': string
    'owl:withRestrictions': [{ 'xsd:minInclusive': Literal }]
  }
  'owl:hasValue': never
}

export interface HasMaximalValueRestriction extends BaseHasValueRestriction {
  'owl:someValuesFrom': DatatypeRestriction & {
    '@type': 'rdfs:Datatype'
    'owl:onDatatype': string
    'owl:withRestrictions': [{ 'xsd:maxInclusive': Literal }]
  }
  'owl:hasValue': never
}

export interface AgentRestriction extends RestrictionNode {
  'owl:onProperty': 'prov:wasAssociatedWith'
  'owl:someValuesFrom': NamedNode | BaseAttributeRestriction
}

export interface BaseAttributeRestriction extends RestrictionNode {
  'owl:onProperty': 'sio:hasAttribute'
}

export interface ClassRestriction extends BaseAttributeRestriction {
  'owl:someValuesFrom':
    | NamedNode
    | (IntersectionClass & { 'owl:intersectionOf': [NamedNode, NamedNode] })
}

export interface AttributeRestriction extends BaseAttributeRestriction {
  'owl:someValuesFrom': IntersectionClass & {
    'owl:intersectionOf': [NamedNode, ...AttributeRestriction[]]
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

export interface BaseValueRestriction extends AttributeRestriction {
  'owl:someValuesFrom':
    | [NamedNode, BaseHasValueRestriction]
    | [NamedNode, BaseHasValueRestriction, UnitRestriction]
}

export interface ValueRestriction extends BaseHasValueRestriction {
  'owl:someValuesFrom':
    | [NamedNode, HasValueRestriction]
    | [NamedNode, HasValueRestriction, UnitRestriction]
}

export interface MinimalValueRestriction extends BaseValueRestriction {
  'owl:someValuesFrom':
    | [NamedNode, HasMinimalValueRestriction]
    | [NamedNode, HasMinimalValueRestriction, UnitRestriction]
}

export interface MaximalValueRestriction extends AttributeRestriction {
  'owl:someValuesFrom':
    | [NamedNode, HasMaximalValueRestriction]
    | [NamedNode, HasMaximalValueRestriction, UnitRestriction]
}

export interface UnitRestriction extends RestrictionNode {
  'owl:onProperty': 'sio:hasUnit'
  'owl:someValuesFrom':
    | NamedNode
    | (IntersectionClass & { 'owl:intersectionOf': [NamedNode, NamedNode] })
}

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

type ValidityRestriction = StartTimeRestriction | EndTimeRestriction

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
