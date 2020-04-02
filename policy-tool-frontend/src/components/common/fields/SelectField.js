import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'

export default function SelectField({ value, valueType, onChange, options }) {
  return (
    <FormControl fullWidth>
      <InputLabel>Value</InputLabel>
      <Select
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option, index) => (
          <MenuItem value={option.value} key={`${option.value}-${index}`}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
