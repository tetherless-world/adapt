import React from 'react'

import {
  DateTimeField,
  SelectField,
  TextInput,
  UnknownField
} from '../../../common/fields'

export default function AttributeValue({
  value,
  valueType,
  onChange,
  title = undefined
}) {
  let FieldComponent = null
  if (!!valueType) {
    switch (valueType) {
      case 'http://www.w3.org/2001/XMLSchema#float':
        FieldComponent = TextInput
        break
      case 'http://www.w3.org/2001/XMLSchema#string':
        FieldComponent = TextInput
        break
      case 'http://www.w3.org/2001/XMLSchema#dateTime':
        FieldComponent = DateTimeField
        break
      default:
        //   FieldComponent = SelectField
        FieldComponent = UnknownField
    }
  }

  return (
    <FieldComponent
      value={value}
      field={{
        id: title,
        title: title || 'Value',
        type: valueType
      }}
      onChange={onChange}
    />
  )
}
