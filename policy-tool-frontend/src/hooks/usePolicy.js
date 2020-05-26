import { useState, useMemo } from 'react'
import _ from 'lodash'

// const newPolicyGraph = {
//   '@context': {
//     owl: 'http://www.w3.org/2002/07/owl#',
//     rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
//     skos: 'http://www.w3.org/2004/02/skos/core#',
//     purl: 'http://purl.org/twc/policy/',
//   },
//   '@graph': [
//     {
//       '@id': '',
//       '@type': ['owl:Class', 'owl:NamedIndividual', 'purl:Policy'],
//       'rdfs:label': [{ '@value': '' }],
//       'skos:definition': [{ '@value': '' }],
//       'rdfs:subClassOf': [],
//       'owl:equivalentClass': [
//         {
//           'purl:hasRole': [{ '@value': 'owl:intersectionOf' }],
//           '@type': ['owl:Class'],
//           'owl:intersectionOf': [{ '@list': [] }],
//         },
//       ],
//     },
//   ],
// }

const newPolicy = () => ({
  id: '',
  label: '',
  source: '',
  definition: '',
  action: '',
  precedence: '',
  effects: [],
  obligations: [],
  attributes: [],
})

export default function usePolicy() {
  const [state, setState] = useState(newPolicy())

  const set = (keys) => (value) => {
    setState((prev) => {
      let copy = { ...prev }
      _.set(copy, keys, value)
      return copy
    })
  }

  // POLICY INFORMATION
  const setId = set(['id'])
  const setLabel = set(['label'])
  const setSource = set(['source'])
  const setDefinition = set(['definition'])

  // POLICY CONDITIONS
  const setAction = set(['action'])
  const setPrecedence = set(['precedence'])

  // POLICY EFFECTS
  const effects = {
    set: set(['effects']),
    add: (effect) => {
      setState((prev) => {
        return {
          ...prev,
          effects: [...prev.effects, _.cloneDeep(effect)],
        }
      })
    },
    delete: (index) => {
      setState((prev) => {
        return {
          ...prev,
          effects: prev.effects.filter((_, i) => i !== index),
        }
      })
    },
    updateValue: (keys) => (value) => {
      setState((prev) => {
        let copy = { ...prev }
        _.set(copy, ['effects', ...keys], value)
        return copy
      })
    },
    getValue: (keys) => {
      return _.get(state.effects, [...keys], undefined)
    },
    reset: () => {
      set(['effects'])([])
    },
  }

  // POLICY OBLIGATIONS
  const obligations = {
    set: set(['obligations']),
    add: (obligation) => {
      setState((prev) => {
        return {
          ...prev,
          obligations: [...prev.obligations, _.cloneDeep(obligation)],
        }
      })
    },
    delete: (index) => {
      setState((prev) => {
        return {
          ...prev,
          obligations: prev.obligations.filter((_, i) => i !== index),
        }
      })
    },
    updateValue: (keys) => (value) => {
      setState((prev) => {
        let copy = { ...prev }
        _.set(copy, ['obligations', ...keys], value)
        return copy
      })
    },
    getValue: (keys) => {
      return _.get(state.obligations, [...keys], undefined)
    },
    reset: () => {
      set(['obligations'])([])
    },
  }

  // POLICY ATTRIBUTES
  const attributes = {
    set: set(['attributes']),
    add: (attribute) => {
      setState((prev) => {
        return {
          ...prev,
          attributes: [...prev.attributes, _.cloneDeep(attribute)],
        }
      })
    },
    delete: (index) => {
      setState((prev) => {
        return {
          ...prev,
          attributes: prev.attributes.filter((_, i) => i !== index),
        }
      })
    },
    updateValue: (keys) => (value) => {
      setState((prev) => {
        let copy = { ...prev }
        _.set(copy, ['attributes', ...keys], value)
        return copy
      })
    },
    getValue: (keys) => {
      return _.get(state.attributes, [...keys], undefined)
    },
    reset: () => {
      set(['attributes'])([])
    },
  }

  const attributesAreValid = ({ attributes, values }) => {
    if (!!values?.length) {
      return values?.every((v) => !!v['@value'])
    } else if (!!attributes?.length) {
      return attributes?.every(attributesAreValid)
    }
  }

  const isValid = useMemo(
    () =>
      [
        !!state.id,
        //!!state.source,
        !!state.label,
        !!state.definition,
        !!state.action,
        !!state.precedence,
        !!state.effects.every((v) => !!v['@value']),
        !!state.obligations.every((v) => !!v['@value']),
        !!state.attributes.every(attributesAreValid),
      ].every((v) => !!v),
    [state]
  )

  return {
    state,
    setId,
    setLabel,
    setSource,
    setDefinition,
    setAction,
    setPrecedence,
    isValid,
    effects,
    obligations,
    attributes,
  }
}
