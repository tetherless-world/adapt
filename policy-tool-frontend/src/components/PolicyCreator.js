import React, { useState } from 'react'
import { Grid, makeStyles, Button } from '@material-ui/core'
import MuiDataform from 'mui-dataforms'

import useApi from '../functions/BackendApi'
import AttributeEditor from './AttributeEditor'
import PreviewJson from './PreviewJson'

const useStyles = makeStyles(theme => ({
  preview: {
    paddingTop: theme.spacing(8)
  },
  create: {
    paddingTop: theme.spacing(8)
  }
}))

export default function PolicyCreator () {

  const api = useApi()
  const classes = useStyles()

  // State variables
  const [policy, setPolicy] = useState({
    source: null,
    id: null,
    label: null,
    definition: null,
    attributes: [{ attr: '', values: [] }]
  })

  // State mutators
  const handleOnChange = key => value => {
    setPolicy(prev => ({ ...prev, [key]: value }))
  }
  const setAttributes = (apply) => {
    setPolicy(prev => ({ ...prev, attributes: apply(prev.attributes) }))
  }

  // Attribute functions
  const newValue = () => (null)
  const newAttribute = () => ({ attr: '', values: [] })
  const AttributeEditorFunctions = {
    addIntersection: () => { setAttributes(prevAttrs => [...prevAttrs, newAttribute()]) },
    addUnion: (index) => {
      setAttributes(prevAttrs => {
        let copy = [...prevAttrs]
        copy[index].values = [...copy[index].values, newValue()]
        return copy
      })
    },
    deleteValue: (index, valueIndex) => {
      setAttributes(prevAttrs => {
        let copy = [...prevAttrs]
        copy[index].values = copy[index].values.filter((_, i) => i !== valueIndex)
        return copy
      })
    },
    clearAttributes: () => { setAttributes(() => [newAttribute()]) }
  }

  // Form fields
  const fields = [
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
    },
    {
      title: 'Additional Rules',
      description: 'Enter additional rules for the new policy',
      fields: [
        {
          id: 'attributes',
          type: 'custom',
          Component: () => <AttributeEditor attributes={policy.attributes} {...AttributeEditorFunctions} />,
        },
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
    api.constructPolicy(policy).then(d => console.log(d))
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <MuiDataform fields={fields} values={policy} onChange={handleOnChange} />
        </Grid>
        <Grid item xs={12} className={classes.preview}>
          <PreviewJson title={'Policy Preview'} data={policy} />
        </Grid>
        <Grid item className={classes.create}>
          <Button onClick={handleOnClickConstruct}>Construct</Button>
        </Grid>
      </Grid>
    </>
  )
}