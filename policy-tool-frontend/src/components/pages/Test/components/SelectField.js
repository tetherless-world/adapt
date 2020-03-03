import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'

export default function SelectField({
  value,
  onChange,
  field: { id, title, options },
  ...props
}) {
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={id}>{title}</InputLabel>
      <Select
        value={value || ''}
        inputProps={{
          name: id,
          id: id
        }}
        onChange={event => {
          onChange(event.target.value)
          console.log(event)
        }}
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
