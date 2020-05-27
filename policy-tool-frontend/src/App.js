import React from 'react'
import { ThemeProvider, CssBaseline } from '@material-ui/core'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import theme from './theme'

import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Builder from './pages/Builder'

export default function App() {
  return (
    <div>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Router>
          <Layout title={'Policy Builder'}>
            <Switch>
              <Route path={'/builder'} component={Builder} />
              <Route path={'/'} exact component={Home} />
              <Route path={'*'} component={NotFound} />
            </Switch>
          </Layout>
        </Router>
      </ThemeProvider>
    </div>
  )
}
