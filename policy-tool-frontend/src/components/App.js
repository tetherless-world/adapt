import React from 'react'
import { Container, CssBaseline, makeStyles } from '@material-ui/core'
import Navigation from './Navigation'
import PolicyCreator from './PolicyCreator'

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(8)
  }
}))

export default function App () {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container>
        <Navigation title={'Policy Creator'} />
        <PolicyCreator />
      </Container>
    </div>
  )
}