import React, { useMemo } from 'react'
import { TextField } from '@material-ui/core'
import getInputType from '../functions/getInputType'
import SelectWrapper from './SelectWrapper'

export default function AttributeInput({
  type_uri,
  attributeOptions,
  ...props
}) {
  const type = useMemo(() => getInputType(type_uri), [type_uri])

  return (
    <>
      {type === 'select' ? (
        <SelectWrapper options={attributeOptions} {...props} />
      ) : type === 'boolean' ? (
        <SelectWrapper
          options={[
            { value: true, label: 'True' },
            { value: false, label: 'False' },
          ]}
          {...props}
        />
      ) : type === 'datetime-local' || type === 'date' || type === 'time' ? (
        <TextField type={type} {...props} InputLabelProps={{ shrink: true }} />
      ) : (
        <TextField type={type} {...props} />
      )}
    </>
  )
}
