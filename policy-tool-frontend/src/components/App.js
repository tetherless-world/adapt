import React from 'react'
import { Container, makeStyles, Typography, CssBaseline } from '@material-ui/core'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navigation from './common/Navigation'
import PolicyCreator from './PolicyCreator/PolicyCreator'
import DomainSelection from './DomainSelection/DomainSelection'

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(8)
  }
}))

export default function App () {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <Container>
        <Navigation title={'Policy Creator'} />
        <BrowserRouter>
          <Switch >
            <Route path={'/creator'} exact>
              <PolicyCreator />
            </Route>
            <Route path={'/domains'} exact>
              <DomainSelection />
            </Route>
            <Route path={'/'}>
              <Typography variant={'h1'}>Hello there!</Typography>
            </Route>
          </Switch>
        </BrowserRouter>
      </Container>
    </div>
  )
}