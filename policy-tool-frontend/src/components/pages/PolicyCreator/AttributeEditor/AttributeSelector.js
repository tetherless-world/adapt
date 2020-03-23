import React from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core'

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
          value={attribute.attributeName}
          onChange={event => onChange(event.target.value)}
        >
          {validAttributes.map((option, index) => (
            <MenuItem value={option.attributeName} key={index}>
              {option.attributeName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
