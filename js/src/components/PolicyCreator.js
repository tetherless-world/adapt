import React, { useState } from 'react'
import { Typography, Grid, makeStyles, Switch, Collapse } from '@material-ui/core'
import MuiDataform from 'mui-dataforms'
import AttributeEditor from './AttributeEditor'

const useStyles = makeStyles(theme => ({
  preview: {
    paddingTop: theme.spacing(8)
  }
}))

export default function PolicyCreator () {

  const classes = useStyles()

  const [state, setState] = useState({
    source: null,
    id: null,
    label: null,
    definition: null,
    attributes: [{ attr: '', values: [] }]
  })

  const [showPreview, setShowPreview] = useState(false)

  const handleOnChange = key => value => {
    setState(prevValues => ({
      ...prevValues,
      [key]: value
    }))
  }

  const newValue = () => (null)
  const newAttribute = () => ({ attr: '', values: [] })
  const setAttributes = (apply) => {
    setState(prevValues => ({
      ...prevValues,
      attributes: apply(prevValues.attributes)
    }))
  }
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
          Component: () => <AttributeEditor attributes={state.attributes} {...AttributeEditorFunctions} />,
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


  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <MuiDataform fields={fields} values={state} onChange={handleOnChange} />
        </Grid>
        <Grid item xs={12} className={classes.preview}>
          <Grid container spacing={4}>
            <Grid item>
              <Typography variant={'h5'}>Policy Preview</Typography>
            </Grid>
            <Grid item>
              <Switch value={showPreview} onClick={() => setShowPreview(!showPreview)} />
            </Grid>
          </Grid>
          <Grid container item>
            <Collapse in={showPreview}>
              <pre>
                {JSON.stringify(state, null, 2)}
              </pre>
            </Collapse>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}