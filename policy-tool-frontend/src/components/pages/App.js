import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import PolicyCreator from './PolicyCreator/PolicyCreator'
// import DomainSelection from './DomainSelection'
import Layout from '../common/Layout'
import NotFound from './NotFound'
import Home from './Home'

export default function App() {
  return (
    <Layout title={'Policy Creator'}>
      <BrowserRouter>
        <Switch>
          <Route path={'/creator'} exact component={PolicyCreator} />
          {/* <Route path={'/domains'} exact component={DomainSelection} /> */}
          <Route path={'/'} exact component={Home} />
          <Route path={'*'} component={NotFound} />
        </Switch>
      </BrowserRouter>
    </Layout>
  )
}
