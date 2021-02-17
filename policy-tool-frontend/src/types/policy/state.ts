import {
  AgentRestriction,
  NamedNode,
  ValidityRestriction,
} from '../restrictions'

export interface PolicyState {
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
      // Agent and Attribute / Validity  restrictions
      ...(AgentRestriction | ValidityRestriction)[]
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
