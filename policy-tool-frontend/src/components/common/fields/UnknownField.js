import React from 'react'
import { Typography } from '@material-ui/core'

export default function UnknownField({ value, valueType, onChange }) {
  return (
    <>
      <Typography color={'error'}>
        Unknown field type `{valueType || 'undefined'}` for this attribute.
      </Typography>
    </>
  )
}
