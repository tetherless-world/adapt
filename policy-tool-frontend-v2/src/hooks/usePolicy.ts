import { useState } from 'react'
import { SimpleState, PolicyState } from '../global'
import { useListState } from './useListState'

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
  const [source, setSource] = useState<string>('')
  const [id, setId] = useState<string>('')
  const [label, setLabel] = useState<string | null>(null)
  const [definition, setDefinition] = useState<string | null>(null)
  const [action, setAction] = useState<string | null>(null)
  const [precedence, setPrecedence] = useState<string | null>(null)
  const requesterRestrictions = useListState<any>()
  const requestRestrictions = useListState<any>()
  const effects = useListState<any>()

  const root = getIdentifier(source, id)

  const data = {
    [root]: {
      a: 'owl:Class',
      'rdf:label': label,
      'skos:definition': definition,
      'owl:subClassOf': [precedence, ...effects.data],
      'owl:equivalentClass': {
        a: 'owl:Class',
        'owl:intersectionOf': [
          action,
          ...requestRestrictions.data,
          ...requesterRestrictions.data,
        ],
      },
    },
  }

  return {
    data,
    source: toSimpleState(source, setSource),
    id: toSimpleState(id, setId),
    label: toSimpleState(label, setLabel),
    definition: toSimpleState(definition, setDefinition),
    action: toSimpleState(action, setAction),
    precedence: toSimpleState(precedence, setPrecedence),
    effects,
    restrictions: {
      request: requestRestrictions,
      requester: requesterRestrictions,
    },
  }
}
