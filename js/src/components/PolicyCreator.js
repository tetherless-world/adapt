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
          size: { xs: 12, sm: 6 },
          options: [
            {
              value: 'lorem',
              label: 'lorem'
            },
            {
              value: 'ipsum',
              label: 'ipsum'
            }
          ]
        },
        {
          id: 'id',
          title: 'Policy Id',
          type: 'text',
          size: { xs: 12, sm: 6 },
        },
        {
          id: 'label',
          title: 'Policy Label',
          type: 'text',
          size: { xs: 12, sm: 6 },
        },
        {
          type: 'spacer',
          size: { xs: false, sm: 6 }
        },
        {
          id: 'definition',
          title: 'Policy Definition',
          type: 'text',
          size: { xs: 12 }
        }
      ]
    }
  ]

  const [values, setValues] = useState({})

  const handleOnChange = (key) => (value) => {
    setValues(prevValues => ({ ...prevValues, [key]: value }))
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <MuiDataform fields={fields} values={values} onChange={handleOnChange} />
        </Grid>
        <Grid item xs={12} style={{paddingTop:30}}>
          <AttributeEditor/>
        </Grid>
        <Grid item xs={12} className={classes.preview}>
          <Typography variant={'h5'}>Preview</Typography>
          <pre>
            {JSON.stringify(values, null, 2)}
          </pre>
        </Grid>
      </Grid>

    </>
  )

}