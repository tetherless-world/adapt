import React, { useState } from 'react'
import { Typography, Grid, makeStyles } from '@material-ui/core'
import MuiDataform from 'mui-dataforms'
import AttributeEditor from './AttributeEditor'

const useStyles = makeStyles(theme => ({
  root: {},
  form: {},
  preview: {
    paddingTop: theme.spacing(2)
  }
}))

export default function PolicyCreator () {

  const classes = useStyles()

  const [state, setState] = useState({ attributes: [{ attr: '', values: [] }] })

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

  const ButtonFunctions = {
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
          options: [
            { value: 'lorem', label: 'lorem' },
            { value: 'ipsum', label: 'ipsum' }
          ]
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
      title: 'Attributes',
      description: 'Edit the policy attributes',
      fields: [
        {
          id: 'attributes',
          type: 'custom',
          Component: () => <AttributeEditor attributes={state.attributes} {...ButtonFunctions} />,
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
          <Typography variant={'h5'}>Preview</Typography>
          <pre>
            {JSON.stringify(state, null, 2)}
          </pre>
        </Grid>
      </Grid>

    </>
  )
}