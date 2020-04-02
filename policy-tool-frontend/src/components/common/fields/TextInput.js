import React from 'react'
import { FormControl, TextField } from '@material-ui/core'

export default function TextInput({ value, valueType, onChange }) {
  let fieldType = null
  switch (valueType) {
    case 'http://www.w3.org/2001/XMLSchema#float':
      fieldType = 'number'
      break
    case 'http://www.w3.org/2001/XMLSchema#string':
      fieldType = 'text'
      break
    default:
      fieldType = 'text'
  }

  return (
    <FormControl fullWidth>
      <TextField
        label={'Value'}
        type={fieldType}
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        fullWidth
      />
    </FormControl>
  )
}
