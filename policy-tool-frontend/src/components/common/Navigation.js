import React from 'react';
import { AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(4)
  },
  title: {
    flexGrow: 1
  }
}))

export default function Navigation ({ title }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position={'static'}>
        <Toolbar>
          <Typography variant={'h5'} className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}