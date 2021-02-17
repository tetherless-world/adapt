import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'
import _, { PropertyPath } from 'lodash'
import { PolicyState } from 'src/types/policy'
import {
  AgentRestriction,
  isAgentRestriction,
  isValidityRestriction,
  ValidityRestriction,
} from 'src/types/restrictions'

const init: PolicyState = {
  '@id': '',
  '@type': 'pol:Policy',
  'rdfs:label': '',
  'skos:definition': '',
  'owl:equivalentClass': {
    '@type': 'owl:Class',
    'owl:intersectionOf': [{ '@id': '' }],
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
        state['owl:equivalentClass']['owl:intersectionOf'][0]['@id'] =
          action.payload
      },
    },
    setPrecedence: {
      prepare: (precedence: string) => ({ payload: precedence }),
      reducer: (state, action: PayloadAction<string>) => {
        state['rdfs:subClassOf'][0]['@id'] = action.payload
      },
    },
    addAgentRestriction: {
      prepare: (restriction: AgentRestriction) => ({
        payload: restriction,
      }),
      reducer: (state, action: PayloadAction<AgentRestriction>) => {
        let [a, ...rest] = state['owl:equivalentClass']['owl:intersectionOf']
        let i = rest.findIndex(isValidityRestriction)
        if (i === -1)
          state['owl:equivalentClass']['owl:intersectionOf'].push(
            action.payload
          )
        else
          state['owl:equivalentClass']['owl:intersectionOf'].splice(
            i,
            0,
            action.payload
          )
      },
    },
    deleteAgentRestriction: {
      prepare: (index: number) => ({ payload: index }),
      reducer: (state, action: PayloadAction<number>) => {
        state['owl:equivalentClass']['owl:intersectionOf'].splice(
          action.payload + 1,
          1
        )
      },
    },
    resetAgentRestrictions: (state) => {
      let [a, ...rest] = state['owl:equivalentClass']['owl:intersectionOf']
      state['owl:equivalentClass']['owl:intersectionOf'] = [
        a,
        ...rest.filter((r) => !isAgentRestriction(r)),
      ]
    },
    addValidityRestriction: {
      prepare: (restriction: ValidityRestriction) => ({
        payload: restriction,
      }),
      reducer: (state, action: PayloadAction<ValidityRestriction>) => {
        state['owl:equivalentClass']['owl:intersectionOf'].push(action.payload)
      },
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
