import React from 'react'

import SelectField from './components/SelectField'
import UnknownField from './components/UnknownField'
import { Grid } from '@material-ui/core'





export default function Value ({
  field,
  value,
  onChange
}) {
  console.log(field)
  let FieldComponent = UnknownField
  if (!!field.type) {
    switch (field.type) {
      case 'xsd:datetime':
        FieldComponent = SelectField
        break
    }
  }

  return (
    <FieldComponent
      field={field}
      value={value}
      onChange={onChange}
      fullWidth
    />
  )

}