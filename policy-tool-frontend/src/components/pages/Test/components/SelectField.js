import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'

export default function SelectField({
  value,
  onChange,
  field: { title, options },
  ...props
}) {
  return (
    <FormControl fullWidth>
      <InputLabel>{title}</InputLabel>
      <Select
        value={value || ''}
        onChange={event => onChange(event.target.value)}
        {...props}
      >
        {options.map((option, index) => (
          <MenuItem value={option.value} key={index}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
