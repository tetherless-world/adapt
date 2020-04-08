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
          options: [],
          size: {
            xs: 12,
            sm: 6
          }
        },
        {
          id: 'id',
          title: 'Policy Id',
          type: 'text',
          size: {
            xs: 12,
            sm: 6
          },
        },
        {
          id: 'label',
          title: 'Policy Label',
          type: 'text'
        },

        {
          id: 'definition',
          title: 'Policy Definition',
          type: 'text',
          props: {
            multiline: true,
            variant: 'outlined'
          }
        }
      ]
    }
  ]

  return <MuiDataform fields={fields} {...props} />
}
