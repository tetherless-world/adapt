import { PolicyState } from 'src/types/policy'

export const restrictionsSelector = (state: PolicyState) =>
  state['owl:equivalentClass']['owl:intersectionOf']
