import { createSelector } from '@reduxjs/toolkit'
import { OWL, RDFS, SKOS } from 'src/namespaces'
import { NamedNode } from 'src/types/base'
import { PolicyState } from 'src/types/policy'
import { AgentRestriction, ValidityRestriction } from 'src/types/restrictions'

export const selectRestrictions = (
  state: PolicyState
): [NamedNode, ...(AgentRestriction | ValidityRestriction)[]] =>
  state[OWL.equivalentClass][OWL.intersectionOf]

export const selectAction = createSelector(selectRestrictions, (res) => res[0])

export const selectPrecedence = (state: PolicyState) =>
  state[RDFS.subClassOf][0]

export const selectEffect = (state: PolicyState) => state[RDFS.subClassOf][1]

export const selectDefinition = (state: PolicyState) => state[SKOS.definition]
export const selectLabel = (state: PolicyState) => state[RDFS.label]
