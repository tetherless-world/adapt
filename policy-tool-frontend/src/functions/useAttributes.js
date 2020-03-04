import { useState, useEffect } from 'react'

export default function useAttributes(attributes, setAttributes) {

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

  const blankAttribute = () => ({ name: '', type: '', values: [] })

  // const handleChangeAttributeName = index => name => {
  //   setAttributes(prev => {
  //     prev[index] = {
  //       ...prev[index],
  //       ...validAttributes.filter(attr => attr.name === name).shift()
  //     }
  //     return [...prev]
  //   })
  // }

  // const handleAddAttribute = () => {
  //   setAttributes(prev => [...prev, blankAttribute()])
  // }

  // const handleAddValue = index => {
  //   setAttributes(prev => {
  //     prev[index].values = [...prev.index.values, null]
  //     return [...prev]
  //   })
  // }

  // const handleChangeAttributeValue = attrIndex => valueIndex => newValue => {
  //   setAttributes(prev => {
  //     prev[index].values[key] = value
  //     return [...prev]
  //   })
  // }

  useEffect(() => {
    setAttributes([blankAttribute()])
  }, [])

  return {
    attributes,
    setAttributes,
    updateAttribute,
    updateValue
  }
}
