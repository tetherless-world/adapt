import { useState, useMemo } from 'react'
import _ from 'lodash'

// REQUEST OBJECT
const newRequest = () => ({
  id: '',
  label: '',
  definition: '',
  attributes: [],
})

export default function useRequest() {
  const [state, setState] = useState(newRequest())

  // SET VALUES
  const set = (keys) => (value) => {
    setState((prev) => {
      let copy = { ...prev }
      _.set(copy, keys, value)
      return copy
    })
  }

  // REQUEST INFORMATION
  const setId = set(['id'])
  const setLabel = set(['label'])
  const setDefinition = set(['definition'])

  // REQUEST ATTRIBUTES
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

  // CHECK ATTRIBUTES VALIDITY
  const attributesAreValid = ({ attributes, values }) => {
    if (!!values?.length) {
      return values?.every((v) => v['@value']!==null)
    } else if (!!attributes?.length) {
      return attributes?.every(attributesAreValid)
    }
  }

  // CHECK REQUEST VALIDITY
  const isValid = useMemo(
    () =>
      [
        !!state.id,
        !!state.label,
        !!state.definition,
        !!state.attributes.every(attributesAreValid),
      ].every((v) => !!v),
    [state]
  )

  return {
    state,
    setId,
    setLabel,
    setDefinition,
    isValid,
    attributes,
  }
}