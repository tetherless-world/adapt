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


export default function NotFound () {
  const classes = useStyles()
  return (
    <div>
      <Grid container justify={'center'} className={classes.root}>
        <Grid item className={classes.title}>
          <Typography variant={'h1'}>¯\_(ツ)_/¯</Typography>
        </Grid>
      </Grid>
      <Grid container justify={'center'} className={classes.root}>
        <Grid item>
          <Typography variant={'h4'}>
            Sorry, the page you were looking for could not be found.
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}