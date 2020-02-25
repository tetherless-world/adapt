import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PolicyCreator from './PolicyCreator/PolicyCreator'
import DomainSelection from './DomainSelection/DomainSelection'
import Layout from './common/Layout';
import NotFound from './common/NotFound'


export default function App () {
  return (
    <Layout title={'Policy Creator'}>
      <BrowserRouter>
        <Switch >
          <Route path={'/creator'} exact component={PolicyCreator} />
          <Route path={'/domains'} exact component={DomainSelection} />
          <Route path={'*'} component={NotFound} />
        </Switch>
      </BrowserRouter>
    </Layout>
  )
}