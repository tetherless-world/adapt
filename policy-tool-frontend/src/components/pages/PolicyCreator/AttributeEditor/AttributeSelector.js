import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'

export default function AttributeSelector({
  attribute,
  onChange,
  validAttributes
}) {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Attribute</InputLabel>
        <Select
          value={attribute.uri}
          onChange={(event) => onChange(event.target.value)}
        >
          {validAttributes &&
            validAttributes.map((option, index) => (
              <MenuItem
                value={option.uri}
                key={`${option.uri}-${index}`}
              >
                {option.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  )
}
