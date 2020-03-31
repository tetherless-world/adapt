import React, { useState, useMemo } from 'react'
import { Grid, Typography } from '@material-ui/core'
import MuiDataform from 'mui-dataforms'

import AttributeEditor from './AttributeEditor/AttributeEditor'
import PreviewJson from '../../common/PreviewJson'
import LoadingWrapper from '../../common/LoadingWrapper'

import { useGetValidAttributes } from '../../../functions/useAPI'
import { useEffectOnce } from 'react-use'

export default function PolicyCreator() {
  // state vars

  const [conditions, setConditions] = useState({
    precedence: '',
    effect: '',
    obligation: ''
  })

  const [info, setInfo] = useState({
    definition: '',
    id: '',
    label: '',
    source: ''
  })

  const [attributes, setAttributes] = useState([])
  const [resGetValidAttr, getValidAttributes] = useGetValidAttributes()

  const isLoading = useMemo(() => resGetValidAttr.loading, [resGetValidAttr])
  const validAttributes = useMemo(() => {
    return resGetValidAttr.value || []
  }, [resGetValidAttr])

  useEffectOnce(() => {
    getValidAttributes()
  })

  // Handling changes
  const handleOnChange = (setState) => (key) => (value) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  // Form fields
  const infoFields = [
    {
      title: 'Policy Information',
      description: 'Provide some basic information about the policy',
      fields: [
        {
          id: 'source',
          title: 'Policy Source',
          type: 'select',
          size: { sm: 6 },
          options: []
        },
        {
          id: 'id',
          title: 'Policy Id',
          type: 'text',
          size: { sm: 6 }
        },
        {
          id: 'label',
          title: 'Policy Label',
          type: 'text',
          size: { sm: 6 }
        },
        {
          type: 'spacer',
          size: { xs: false, sm: 6 }
        },
        {
          id: 'definition',
          title: 'Policy Definition',
          type: 'text'
        }
      ]
    }
  ]

  const conditionsFields = [
    {
      title: 'Conditions and Effects',
      fields: [
        {
          id: 'action',
          title: 'Policy Action',
          type: 'select',
          size: { sm: 6 },
          options: []
        },
        {
          type: 'spacer',
          size: { xs: false, sm: 6 },
          options: []
        },
        {
          id: 'effect',
          title: 'Policy Effect',
          type: 'select',
          size: { sm: 6 },
          options: []
        },
        {
          type: 'spacer',
          size: { xs: false, sm: 6 }
        },
        {
          id: 'obligations',
          title: 'Policy Obligations',
          type: 'select',
          size: { sm: 6 },
          options: []
          // predefined, or user input
        },
        {
          type: 'spacer',
          size: { xs: false, sm: 6 }
        },
        {
          id: 'precedence',
          title: 'Policy Precedence',
          type: 'select',
          size: { sm: 6 },
          options: []
        }
      ]
    }
  ]

  return (
    <>
      <LoadingWrapper isLoading={isLoading}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <MuiDataform
              fields={infoFields}
              values={info}
              onChange={handleOnChange(setInfo)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'h5'}>Rules</Typography>
            <AttributeEditor
              attributes={attributes}
              setAttributes={setAttributes}
              validAttributes={validAttributes}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiDataform
              fields={conditionsFields}
              values={conditions}
              onChange={handleOnChange(setConditions)}
            />
          </Grid>
          <Grid item xs={12}>
            <PreviewJson
              title={'Policy Preview'}
              data={{ info, attributes, conditions }}
            />
          </Grid>
        </Grid>
      </LoadingWrapper>
    </>
  )
}
