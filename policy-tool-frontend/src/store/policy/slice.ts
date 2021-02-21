import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'
import _, { PropertyPath } from 'lodash'
import { OWL, POL, RDFS, SKOS } from 'src/namespaces'
import { PolicyState } from 'src/types/policy'
import {
  AgentRestriction,
  isAgentRestriction,
  isValidityRestriction,
  ValidityRestriction,
} from 'src/types/restrictions'

const init: PolicyState = {
  '@id': '',
  '@type': POL.Policy,
  [RDFS.label]: '',
  [SKOS.definition]: '',
  [OWL.equivalentClass]: {
    '@type': OWL.Class,
    [OWL.intersectionOf]: [{ '@id': '' }],
  },
  [RDFS.subClassOf]: [{ '@id': '' }, { '@id': '' }],
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
        state[RDFS.label] = action.payload
      },
    },
    setDefinition: {
      prepare: (definition: string) => ({ payload: definition }),
      reducer: (state, action: PayloadAction<string>) => {
        state[SKOS.definition] = action.payload
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
        let subclasses = state[RDFS.subClassOf]
        subclasses[0]['@id'] = action.payload
      },
    },
    addAgentRestriction: {
      prepare: (restriction: AgentRestriction) => ({ payload: restriction }),
      reducer: (state, action: PayloadAction<AgentRestriction>) => {
        let restrictions = state[OWL.equivalentClass][OWL.intersectionOf]
        let [a, ...rest] = restrictions
        let i = rest.findIndex(isValidityRestriction)
        if (i === -1) restrictions.push(action.payload)
        else restrictions.splice(i + 1, 0, action.payload)
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
      let [a, ...rest] = restrictions
      if (rest.findIndex(isAgentRestriction) === -1) return

      let iMax = rest.findIndex(isValidityRestriction)
      if (iMax === -1) restrictions.splice(1, restrictions.length - 1)
      else restrictions.splice(1, iMax)
    },
    addValidityRestriction: {
      prepare: (restriction: ValidityRestriction) => ({ payload: restriction }),
      reducer: (state, action: PayloadAction<ValidityRestriction>) => {
        state[OWL.equivalentClass][OWL.intersectionOf].push(action.payload)
      },
    },
    deleteValidityRestriction: {
      prepare: (index: number) => ({ payload: index }),
      reducer: (state, action: PayloadAction<number>) => {
        let restrictions = state[OWL.equivalentClass][OWL.intersectionOf]
        let [a, ...rest] = restrictions
        let iMin = rest.findIndex(isValidityRestriction)
        if (iMin !== -1) restrictions.splice(iMin + 1 + action.payload, 1)
      },
    },
    resetValidityRestrictions: (state) => {
      let restrictions = state[OWL.equivalentClass][OWL.intersectionOf]
      let [a, ...rest] = restrictions
      let iMin = rest.findIndex(isValidityRestriction)
      if (iMin !== -1) restrictions.splice(iMin, restrictions.length - iMin - 1)
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
