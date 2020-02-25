import React, { useState } from 'react'
import { Grid, makeStyles, Button, Typography } from '@material-ui/core'
import MuiDataform from 'mui-dataforms'

import AttributeEditor from './AttributeEditor'
import PreviewJson from './PreviewJson'

import useDomain from '../functions/useDomain'
import useBackendApi from '../functions/useBackendApi'
import useQuery from '../functions/useQuery'

// const useStyles = makeStyles(theme => ({}))

export default function PolicyCreator () {
  const query = useQuery()
  const api = useBackendApi()
  const domain = useDomain(query.get('uri'))
  // const classes = useStyles()

  // state vars
  const [attributes, setAttributes] = useState([])

  const [additionalRules, setAdditionalRules] = useState({
    precedence: '',
    effect: '',
    obligation: ''
  })

  const [info, setInfo] = useState({
    definition: '',
    id: '',
    label: '',
    source: '',
  })

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
          size: { sm: 6 },
        },
        {
          id: 'label',
          title: 'Policy Label',
          type: 'text',
          size: { sm: 6 },
        },
        {
          type: 'spacer',
          size: { xs: false, sm: 6 }
        },
        {
          id: 'definition',
          title: 'Policy Definition',
          type: 'text'
        },
      ]
    }
  ]

  const additionalRulesFields = [
    {
      title: 'Additional Rules',
      description: 'Enter additional rules for the new policy',
      fields: [
        {
          id: 'precedence',
          title: 'Policy Precedence',
          type: 'select',
          size: { sm: 6 },
          options: []
        },
        {
          type: 'spacer',
          size: { xs: false, sm: 6 }
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
          id: 'obligation',
          title: 'Policy Obligation',
          type: 'select',
          size: { sm: 6 },
          options: []
        }
      ]
    }
  ]


  // Handling submission
  const handleOnClickConstruct = () => {
    api.constructPolicy(info).then(d => console.log(d))
  }

  return (
    <>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <MuiDataform
            fields={infoFields}
            values={info}
            onChange={handleOnChange(setInfo)}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant={'h5'}>Attribute Editor</Typography>
          <AttributeEditor attributes={attributes} setAttributes={setAttributes} />
        </Grid>
        <Grid item xs={12}>
          <MuiDataform
            fields={additionalRulesFields}
            values={additionalRules}
            onChange={handleOnChange(setAdditionalRules)}
          />
        </Grid>
        <Grid item xs={12}>
          <PreviewJson title={'Policy Preview'} data={info} />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant={'outlined'}
            color={'primary'}
            onClick={handleOnClickConstruct}
          >
            Construct
          </Button>
        </Grid>
      </Grid>
    </>
  )
}