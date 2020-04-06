import React, { useMemo } from 'react'
import MuiDataform from 'mui-dataforms'

export default function PolicyConditionForm({ fieldOptions, ...props }) {
  const getValidOptions = (fieldName) => {
    return !!fieldOptions && !!fieldOptions[fieldName]
      ? fieldOptions[fieldName]
          .map((option) => ({
            label: option.label,
            value: option.uri
          }))
          .sort((a, b) => (a.value < b.value ? -1 : a.value > b.value ? 1 : 0))
      : []
  }

  let fields = useMemo(() => {
    return [
      {
        title: 'Conditions and Effects',
        fields: [
          {
            id: 'action',
            title: 'Policy Action',
            type: 'select',
            options: getValidOptions('action')
          },
          {
            id: 'effect',
            title: 'Policy Effect',
            type: 'select',
            options: getValidOptions('effect')
          },
          {
            id: 'obligations',
            title: 'Policy Obligations',
            type: 'select',
            options: getValidOptions('obligations')
            // predefined, or user input
          },
          {
            id: 'precedence',
            title: 'Policy Precedence',
            type: 'select',
            options: getValidOptions('precedence')
          }
        ]
      }
    ]
  }, [fieldOptions])

  return <MuiDataform fields={fields} {...props} />
}
