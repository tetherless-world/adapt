import { NamedNode } from 'src/types/base'
import { PolicyState } from 'src/types/policy'
import { AgentRestriction, ValidityRestriction } from 'src/types/restrictions'
import { XOR } from 'ts-xor'

export const selectRestrictions = (
  state: PolicyState
): [NamedNode, ...XOR<AgentRestriction, ValidityRestriction>[]] =>
  state['http://www.w3.org/2002/07/owl#equivalentClass'][
    'http://www.w3.org/2002/07/owl#intersectionOf'
  ]
