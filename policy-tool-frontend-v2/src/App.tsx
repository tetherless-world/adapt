import { MuiThemeProvider } from '@material-ui/core'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Layout } from './components'
import { Builder, Home, NotFound } from './pages'
import { theme } from './theme'

export const App: React.FC = () => (
  <div>
    <MuiThemeProvider theme={theme}>
      <Router>
        <Layout title={'Policy Builder'}>
          <Switch>
            <Route path={'/builder'} component={Builder} />
            <Route path={'/'} exact component={Home} />
            <Route path={'*'} component={NotFound} />
          </Switch>
        </Layout>
      </Router>
    </MuiThemeProvider>
  </div>
)
