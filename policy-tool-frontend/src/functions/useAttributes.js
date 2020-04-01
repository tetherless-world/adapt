export default function useAttributes(attributes, setAttributes) {
  const blankAttribute = () => ({
    attr_uri: '',
    attr_label: '',
    value_type: '',
    values: []
  })

  const resetAttributes = () => {
    setAttributes([])
  }

  const addAttribute = () => {
    setAttributes(prev => [...prev, blankAttribute()])
  }

  const updateAttribute = (index, newAttribute) => {
    setAttributes(prev =>
      prev.map((old, i) => (i === index ? newAttribute : old))
    )
  }

  const updateValue = (index, valueIndex, newValue) => {
    setAttributes(prev =>
      prev.map((attr, i) =>
        i === index
          ? {
              ...attr,
              values: attr.values.map((v, j) =>
                j === valueIndex ? newValue : v
              )
            }
          : attr
      )
    )
  }

  return {
    resetAttributes,
    addAttribute,
    updateAttribute,
    updateValue
  }
}
