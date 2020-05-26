import React from 'react'
import { Grid, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  label: {
    paddingBottom: theme.spacing(1),
  },
}))

export default function FormSection({ label, children, LabelProps, ...props }) {
  const classes = useStyles()
  return (
    <div {...props}>
      <Grid container>
        <Grid item className={classes.label}>
          <Typography variant={'h5'} {...LabelProps}>
            {label}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </div>
  )
}
