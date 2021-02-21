import { OWL } from 'src/namespaces'
import { NamedNode } from 'src/types/base'
import { PolicyState } from 'src/types/policy'
import { AgentRestriction, ValidityRestriction } from 'src/types/restrictions'

export const selectRestrictions = (
  state: PolicyState
): [NamedNode, ...(AgentRestriction | ValidityRestriction)[]] =>
  state[OWL.equivalentClass][OWL.intersectionOf]
