import React from 'react'
import { TextField, FormControl } from '@material-ui/core'

export default function DateTimeField({ value, valueType, onChange }) {
  return (
    <FormControl fullWidth>
      <TextField
        value={value || ''}
        label={'Value'}
        type={'datetime-local'}
        InputLabelProps={{ shrink: true }}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormControl>
  )
}
