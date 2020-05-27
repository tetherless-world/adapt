import React from 'react'
import { TextField, MenuItem } from '@material-ui/core'

export default function SelectWrapper({
  options,
  displayNone = true,
  ...props
}) {
  return (
    <TextField select disabled={!options?.length} {...props}>
      {displayNone && (
        <MenuItem value={''}>
          <em>None</em>
        </MenuItem>
      )}
      {!!options?.length &&
        options?.map(({ value, label }, index) => (
          <MenuItem key={index} value={value}>
            {label}
          </MenuItem>
        ))}
    </TextField>
  )
}
