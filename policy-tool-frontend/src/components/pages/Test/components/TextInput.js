import React from 'react'
import { FormControl, TextField } from '@material-ui/core'

export default function TextInputs({
  value,
  onChange,
  field: { title },
  ...props
}) {
  return (
    <FormControl fullWidth>
      <TextField
        label={title}
        value={value || ''}
        onChange={event => onChange(event.target.value)}
        fullWidth
        {...props}
      />
    </FormControl>
  )
}
