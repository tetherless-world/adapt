import { useState, useEffect } from 'react'

export default function useAttributes(attributes, setAttributes) {
  const blankAttribute = () => ({ attributeName: '', typeInfo: {}, values: [] })

  const resetAttributes = () => {
    setAttributes([blankAttribute()])
  }

  const addAttribute = () => {
    setAttributes(prev => [...prev, blankAttribute()])
  }

  const updateAttribute = (index, newAttribute) => {
    setAttributes(prev =>
      prev.map((oldAttribute, idx) =>
        idx === index ? newAttribute : oldAttribute
      )
    )
  }

  const updateValue = (index, valueIndex, newValue) => {
    setAttributes(prev =>
      prev.map((attr, idx1) =>
        idx1 === index
          ? {
              ...attr,
              values: attr.values.map((v, idx2) =>
                idx2 === valueIndex ? newValue : v
              )
            }
          : attr
      )
    )
  }

  useEffect(() => {
    addAttribute()
  }, [])

  return {
    attributes,
    setAttributes,
    resetAttributes,
    addAttribute,
    updateAttribute,
    updateValue
  }
}
