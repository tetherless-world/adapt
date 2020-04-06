import React from 'react'
import { TextField, FormControl } from '@material-ui/core'

export default function DateTimeField({ value, onChange, field: { title } }) {
  return (
    <FormControl fullWidth>
      <TextField
        value={value}
        label={title || 'Value'}
        type={'datetime-local'}
        InputLabelProps={{ shrink: true }}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormControl>
  )
}
