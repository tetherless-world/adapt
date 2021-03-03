import { OWL, POL, RDFS, SKOS } from 'src/namespaces'
import { XOR } from 'ts-xor'
import { NamedNode } from '../base'
import { AgentRestriction, ValidityRestriction } from '../restrictions'

export interface PolicyState {
  // Identifier (source + id)
  '@id': string
  '@type': POL.Policy
  // Label
  [RDFS.label]: string
  // Definition
  [SKOS.definition]: string
  // Restrictions
  [OWL.equivalentClass]: {
    '@type': OWL.Class
    [OWL.intersectionOf]: [
      // Action
      NamedNode,
      // Agent and Attribute / Validity  restrictions
      ...(AgentRestriction | ValidityRestriction)[]
    ]
  }
  [RDFS.subClassOf]: [
    // Precedence
    NamedNode,
    // Primary Effect
    NamedNode,
    // Additional Effects
    // TODO: How do we distinguish between effects and obligations here?
    // Obligations have been disabled for this reason.
    // Additional effects ignored.
    ...NamedNode[]
  ]
}
