import React from 'react'
import { Grid, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1)
  },
  title: {
    padding: theme.spacing(4)
  }
}))

export default function NotFound() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid container item justify={'center'}>
          <Typography variant={'h1'}>¯\_(ツ)_/¯</Typography>
        </Grid>
        <Grid container item justify={'center'}>
          <Typography variant={'h4'}>
            Sorry, the page you were looking for could not be found.
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}
