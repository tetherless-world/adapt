import React, { useState, useEffect } from 'react'
import { Grid, Typography } from '@material-ui/core'
import MuiDataform from 'mui-dataforms'

import AttributeEditor from './AttributeEditor/AttributeEditor'
import PreviewJson from '../../common/PreviewJson'
import LoadingWrapper from '../../common/LoadingWrapper'

import useAPI from '../../../functions/useAPI'
import { DefaultValidAttributes } from '../../../data/DefaultValidAttributes'

const api = useAPI()

export default function PolicyCreator() {
  // state vars

  const [conditions, setConditions] = useState({
    precedence: '',
    effect: '',
    obligation: '',
    action: ''
  })

  const [info, setInfo] = useState({
    definition: '',
    id: '',
    label: '',
    source: ''
  })

  const [isLoading, setIsLoading] = useState(true)
  const [attributes, setAttributes] = useState([])
  const [validAttributes, setValidAttributes] = useState(DefaultValidAttributes)

  const [validActions, setValidActions] = useState([])
  const [validEffects, setValidEffects] = useState([])
  const [validPrecedences, setValidPrecedences] = useState([])

  // get Valid attributes
  useEffect(() => {
    api
      .getValidAttributes()
      .then(data => setValidAttributes(v => [...v, ...data]))
    api
      .getConditions()
      .then(({ actions, precedences, effects }) => {
        console.log(actions)
        setValidActions(v => [...v, actions])
        setValidEffects(v => [...v, effects])
        setValidPrecedences(v => [...v, precedences])
      })
      .then(() => setIsLoading(false))
  }, [])

  // Handling changes
  const handleOnChange = setState => key => value => {
    setState(prev => ({ ...prev, [key]: value }))
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
          options: validActions.map(v => ({ value: v.uri, label: v.label }))
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
          options: validEffects.map(v => ({ value: v.uri, label: v.label }))
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
          options: validPrecedences.map(v => ({ value: v.uri, label: v.label }))
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
