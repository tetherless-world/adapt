import { PolicyState } from 'src/types/policy'

export const restrictionsSelector = (state: PolicyState) =>
  state[OWL.equivalentClass][OWL.intersectionOf]
