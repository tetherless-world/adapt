import { useState, useEffect } from 'react'

export default function useAttributes () {
  const [attributes, setAttributes] = useState([])

  const updateAttribute = (index, newAttribute) => {
    if (attributes.length) {
      setAttributes(prev =>
        prev.map((oldAttribute, i) => i === index ? newAttribute : oldAttribute)
      )
    } else {
      setAttributes([newAttribute])
    }
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
    setAttribute,
    updateAttributes
  }
}