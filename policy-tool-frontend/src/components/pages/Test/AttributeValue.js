import React from 'react'

import SelectField from './components/SelectField'
import UnknownField from './components/UnknownField'
import TextInput from './components/TextInput'
import DateTimeField from './components/DateTimeField'

export default function AttributeValue({
  value,
  typeInfo,
  onChange,
  title = undefined
}) {
  let FieldComponent = UnknownField
  if (!!typeInfo && !!typeInfo['http://semanticscience.org/resource/hasUnit']) {
    switch (typeInfo['http://semanticscience.org/resource/hasUnit']) {
      case 'http://purl.obolibrary.org/obo/UO_0000105':
        FieldComponent = TextInput
        break
      case 'http://www.w3.org/2001/XMLSchema#dateTime':
        FieldComponent = DateTimeField
        break
    }
  }

  return (
    <>
      <FieldComponent
        value={value}
        field={{
          title: title || 'Value',
          type: typeInfo['http://semanticscience.org/resource/hasValue']
        }}
        onChange={onChange}
      />
    </>
  )
}
