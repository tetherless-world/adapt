import React, { useState } from 'react'
import { Typography, Grid, makeStyles } from '@material-ui/core'
import MuiDataform from 'mui-dataforms'
import AttributeEditor from './AttributeEditor'

const useStyles = makeStyles(theme => ({
  root: {},
  form: {},
  preview: {
    paddingTop: theme.spacing(8)
  }
}))

export default function PolicyCreator () {

  const classes = useStyles()

  const fields = [
    {
      title: 'Policy Information',
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
        }
      ]
    }
  ]

  const [state, setState] = useState({ info: {}, attributes: [{ values: [] }] })

  const handleOnChange = key => value => {
    setState(prevValues => ({
      ...prevValues,
      info: {
        ...prevValues.info,
        [key]: value
      }
    }))
  }

  const setAttributes = (apply) => {
    setState(prevValues => ({
      ...prevValues,
      attributes: apply(prevValues.attributes)
    }))
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <MuiDataform fields={fields} values={state} onChange={handleOnChange} />
        </Grid>
        <Grid item xs={12} style={{ paddingTop: 30 }}>
          <Typography variant={'h5'}>Attribute Editor</Typography>
          <AttributeEditor attributes={state.attributes} setAttributes={setAttributes} />
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