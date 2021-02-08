import { NewPolicyState } from 'src/global'

export const restrictionsSelector = (state: NewPolicyState) =>
  state['owl:equivalentClass']['owl:intersectionOf']
