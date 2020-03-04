import React, { useEffect } from 'react'
import { TextField, FormControl, InputLabel } from '@material-ui/core'
import moment from 'moment'

export default function DateTimeField({ value, onChange, field: { title } }) {

  useEffect(() => {
    onChange(moment.utc().toISOString())
  }, [])

  return (
    <FormControl fullWidth>
      <TextField
        value={value}
        label={title || 'Value'}
        type={'datetime-local'}
        InputLabelProps={{ shrink: true }}
        onChange={event => onChange(event.target.value)}
      />
    </FormControl>
  )
}
