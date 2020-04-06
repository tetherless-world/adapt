import React from 'react'

import {
  DateTimeField,
  SelectField,
  TextInput,
  UnknownField,
} from '../../../common/fields'

export default function AttributeValue({ valueType, ...props }) {
  let FieldComponent = UnknownField
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
      case 'http://www.w3.org/2002/07/owl#Class':
        FieldComponent = SelectField
        break
      default:
        FieldComponent = UnknownField
    }
  }

  return <FieldComponent valueType={valueType} {...props} />
}
