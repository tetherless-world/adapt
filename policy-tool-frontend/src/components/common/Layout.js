import React from 'react'
import { makeStyles, CssBaseline, Container } from '@material-ui/core'
import Navigation from './Navigation'

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(8)
  }
}))

export default function Layout ({ title, children }) {
  const classes = useStyles()


  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container>
        <Navigation title={title} />
        {children}
      </Container>
    </div>
  )

}