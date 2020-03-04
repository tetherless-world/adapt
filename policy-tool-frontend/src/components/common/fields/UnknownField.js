import React from 'react'
import { Typography } from '@material-ui/core'

export default function UnknownField({
  value,
  onChange,
  field: { id, type, title },
  ...props
}) {
  return (
    <>
      <Typography color={'error'}>
        Unknown field type `{type || 'undefined'}` for `{id}`
      </Typography>
    </>
  )
}
