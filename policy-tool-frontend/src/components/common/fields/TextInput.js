import React from 'react'
import { FormControl, TextField } from '@material-ui/core'

export default function TextInputs({
  value,
  onChange,
  field: { title, type },
  ...props
}) {
  let fieldType = 'text'
  if (!!type) {
    switch (type) {
      case 'http://www.w3.org/2001/XMLSchema#float':
        fieldType = 'number'
        break
      default:
        fieldType = 'text'
    }
  }

  return (
    <FormControl fullWidth>
      <TextField
        label={title}
        type={fieldType}
        value={value || ''}
        onChange={event => onChange(event.target.value)}
        fullWidth
        {...props}
      />
    </FormControl>
  )
}
