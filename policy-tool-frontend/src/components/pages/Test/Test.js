import React, { useState, useEffect } from 'react'
import AttributeEditor from './AttributeEditor'
import useBackendApi from '../../../functions/useBackendApi'
import LoadingWrapper from '../../common/LoadingWrapper'

export default function Test({}) {
  const api = useBackendApi()
  const [isLoading, setIsLoading] = useState(true)
  const [validAttributes, setValidAttributes] = useState([])
  const [attributes, setAttributes] = useState([])

  useEffect(() => {
    let defaultValidAttributes = [
      {
        attributeName: 'Start Time',
        values: [],
        typeInfo: {
          'http://semanticscience.org/resource/hasUnit':
            'http://www.w3.org/2001/XMLSchema#dateTime'
        }
      },
      {
        attributeName: 'End Time',
        values: [],
        typeInfo: {
          'http://semanticscience.org/resource/hasUnit':
            'http://www.w3.org/2001/XMLSchema#dateTime'
        }
      }
    ]

    api
      .getValidAttributes()
      .then(({ data }) => {
        setValidAttributes([
          ...defaultValidAttributes,
          ...data.map(d => ({ ...d, values: [] }))
        ])
      })
      .then(() => setIsLoading(false))
      .then(console.log(validAttributes))
  }, [])

  return (
    <LoadingWrapper isLoading={isLoading}>
      <AttributeEditor
        attributes={attributes}
        setAttributes={setAttributes}
        validAttributes={validAttributes}
      />
    </LoadingWrapper>
  )
}
