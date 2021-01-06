import { useState } from 'react'
import { SimpleState, PolicyState } from '../global'
import { useListState } from './useListState'
import { useSimpleState } from './useSimpleState'

const toSimpleState = <S>(
  state: S,
  setState: (value: S) => void
): SimpleState<S> => {
  return { get: () => state, set: setState }
}

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
  const requesterRestrictions = useListState()
  const requestRestrictions = useListState()
  const effects = useListState()

  const root = getIdentifier(source.get(), id.get())

  const data = {
    [root]: {
      a: 'owl:Class',
      'rdf:label': label.get() ?? id.get(),
      'skos:definition': definition.get(),
      'owl:subClassOf': [precedence.get(), ...effects.data],
      'owl:equivalentClass': {
        a: 'owl:Class',
        'owl:intersectionOf': [
          action.get(),
          ...requestRestrictions.data,
          ...requesterRestrictions.data,
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
    requestRestrictions,
    requesterRestrictions,
  }
}
