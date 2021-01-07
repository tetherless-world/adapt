import { useState } from 'react'
import { SimpleState, PolicyState } from '../global'
import { useListState } from './useListState'
import { useSimpleState } from './useSimpleState'

const getIdentifier = (source: string, id: string): string => {
  let lastChar = source.charAt(source.length - 1)
  return lastChar === '#' || lastChar === '/'
    ? `${source}${id}`
    : `${source}#${id}`
}

export const usePolicy = (): PolicyState => {
  const source = useSimpleState<string>('')
  const id = useSimpleState<string>('')
  const label = useSimpleState<string | undefined>(undefined)
  const definition = useSimpleState<string | undefined>(undefined)
  const action = useSimpleState<string | null>(null)
  const precedence = useSimpleState<string | null>(null)
  const agentRestrictions = useListState()
  const activityRestrictions = useListState()
  const effects = useListState()

  const root = getIdentifier(source.get(), id.get())

  const data = {
    [root]: {
      a: 'owl:Class',
      'rdf:label': label.get() ?? id.get(),
      'skos:definition': definition.get(),
      'owl:subClassOf': [precedence.get(), ...effects.state],
      'owl:equivalentClass': {
        a: 'owl:Class',
        'owl:intersectionOf': [
          action.get(),
          ...agentRestrictions.state,
          ...activityRestrictions.state,
        ],
      },
    },
  }

  return {
    data,
    source,
    id,
    label,
    definition,
    action,
    precedence,
    effects,
    agentRestrictions,
    activityRestrictions,
  }
}
