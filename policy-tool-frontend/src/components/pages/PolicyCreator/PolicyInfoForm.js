import React from 'react'
import MuiDataform from 'mui-dataforms'

export default function PolicyInfoForm({ ...props }) {
  const fields = [
    {
      title: 'Policy Information',
      description: 'Provide some basic information about the policy',
      fields: [
        {
          id: 'source',
          title: 'Policy Source',
          type: 'select',
          options: []
        },
        {
          id: 'id',
          title: 'Policy Id',
          type: 'text'
        },
        {
          id: 'label',
          title: 'Policy Label',
          type: 'text'
        },

        {
          id: 'definition',
          title: 'Policy Definition',
          type: 'text'
        }
      ]
    }
  ]

  return <MuiDataform fields={fields} {...props} />
}
