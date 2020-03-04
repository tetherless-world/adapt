import React from 'react'
import { TextField, FormControl, InputLabel } from '@material-ui/core'

export default function DateTimeField({ value, onChange, field: { title } }) {
  return (
    <FormControl fullWidth>
      <InputLabel>{title}</InputLabel>
      <TextField type="datetime-local" value={value} onChange={onChange} />
    </FormControl>
  )
}
