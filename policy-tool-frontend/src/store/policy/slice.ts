import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'
import _, { PropertyPath } from 'lodash'
import { OWL } from 'src/namespaces'
import { PolicyState } from 'src/types/policy'
import {
  AgentRestriction,
  isAgentRestriction,
  isRestrictionNode,
  isValidityRestriction,
  ValidityRestriction,
} from 'src/types/restrictions'

const init: PolicyState = {
  '@id': '',
  '@type': 'pol:Policy',
  'rdfs:label': '',
  'skos:definition': '',
  [OWL.equivalentClass]: {
    '@type': OWL.Class,
    [OWL.intersectionOf]: [{ '@id': '' }],
  },
  'rdfs:subClassOf': [{ '@id': '' }, { '@id': '' }],
}

type UpdateURIPayload = { source: string; id: string }
type SetPayload = { keys: PropertyPath; value: any }
type UpdateFunction = (state: Draft<PolicyState>) => void

export const { actions, reducer } = createSlice({
  name: 'policy',
  initialState: init,
  reducers: {
    setURI: {
      prepare: (source: string, id: string) => ({ payload: { source, id } }),
      reducer: (state, action: PayloadAction<UpdateURIPayload>) => {
        state['@id'] = action.payload.source + '#' + action.payload.id
      },
    },
    setLabel: {
      prepare: (label: string) => ({ payload: label }),
      reducer: (state, action: PayloadAction<string>) => {
        state['rdfs:label'] = action.payload
      },
    },
    setDefinition: {
      prepare: (definition: string) => ({ payload: definition }),
      reducer: (state, action: PayloadAction<string>) => {
        state['skos:definition'] = action.payload
      },
    },
    setAction: {
      prepare: (action: string) => ({ payload: action }),
      reducer: (state, action: PayloadAction<string>) => {
        let restrictions = state[OWL.equivalentClass][OWL.intersectionOf]
        restrictions[0]['@id'] = action.payload
      },
    },
    setPrecedence: {
      prepare: (precedence: string) => ({ payload: precedence }),
      reducer: (state, action: PayloadAction<string>) => {
        let subclasses = state['rdfs:subClassOf']
        subclasses[0]['@id'] = action.payload
      },
    },
    addAgentRestriction: {
      prepare: (restriction: AgentRestriction) => ({ payload: restriction }),
      reducer: (state, action: PayloadAction<AgentRestriction>) => {
        let restrictions = state[OWL.equivalentClass][OWL.intersectionOf]
        let i = restrictions.findIndex(
          (r) => isRestrictionNode(r) && !isAgentRestriction(r)
        )
        if (i === -1) restrictions.push(action.payload)
        else restrictions.splice(i, 0, action.payload)
      },
    },
    deleteAgentRestriction: {
      prepare: (index: number) => ({ payload: index }),
      reducer: (state, action: PayloadAction<number>) => {
        let restrictions = state[OWL.equivalentClass][OWL.intersectionOf]
        restrictions.splice(action.payload + 1, 1)
      },
    },
    resetAgentRestrictions: (state) => {
      let restrictions = state[OWL.equivalentClass][OWL.intersectionOf]
      let iMin = restrictions.findIndex(
        (r) => isRestrictionNode(r) && isAgentRestriction(r)
      )
      let iMax = restrictions.findIndex(
        (r) => isRestrictionNode(r) && !isAgentRestriction(r)
      )
      if (iMin === -1) return
      if (iMax === -1) restrictions.splice(1, restrictions.length - 1)
      else restrictions.splice(iMin, iMax - iMin)
    },
    addValidityRestriction: {
      prepare: (restriction: ValidityRestriction) => ({ payload: restriction }),
      reducer: (state, action: PayloadAction<ValidityRestriction>) => {
        let restrictions = state[OWL.equivalentClass][OWL.intersectionOf]
        restrictions.push(action.payload)
      },
    },
    deleteValidityRestriction: {
      prepare: (index: number) => ({ payload: index }),
      reducer: (state, action: PayloadAction<number>) => {
        let restrictions = state[OWL.equivalentClass][OWL.intersectionOf]
        let iMin = restrictions.findIndex(
          (r) => isRestrictionNode(r) && isValidityRestriction(r)
        )
        restrictions.splice(action.payload + iMin, 1)
      },
    },
    resetValidityRestrictions: (state) => {
      let restrictions = state[OWL.equivalentClass][OWL.intersectionOf]
      let iMin = restrictions.findIndex(
        (r) => isRestrictionNode(r) && isValidityRestriction(r)
      )
      if (iMin === -1) return
      restrictions.splice(iMin, restrictions.length - iMin)
    },
    update: {
      prepare: (keys: PropertyPath, value: any) => ({
        payload: { keys, value },
      }),
      reducer: (state, action: PayloadAction<SetPayload>) => {
        _.set(state, action.payload.keys, action.payload.value)
      },
    },
    apply: {
      prepare: (f: UpdateFunction) => ({ payload: f }),
      reducer: (state, action: PayloadAction<UpdateFunction>) => {
        action.payload(state)
      },
    },
  },
})
