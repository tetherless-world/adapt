import React from 'react'
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core'

export default function UnknownField ({
  value,
  onChange,
  field: { id, type, title },
  ...props
}) {
  return (
    <>
      <Typography>Unknown field type `{type}` for `{id}`</Typography>
    </>
  )

}