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
          value={attribute.attr_uri}
          onChange={(event) => onChange(event.target.value)}
        >
          {validAttributes &&
            validAttributes.map((option, index) => (
              <MenuItem
                value={option.attr_uri}
                key={`${option.attr_uri}-${index}`}
              >
                {option.attr_label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  )
}
