import { makeStyles, MuiThemeProvider } from '@material-ui/core'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Layout, LayoutHeader } from './components'
import { Builder, Home, NotFound } from './pages'
import { theme } from './theme'

const useStyles = makeStyles((theme) => ({
  appBar: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
  },
  appTitle: {
    flexGrow: 1,
  },
}))

export const App: React.FC = () => {
  const classes = useStyles(theme)

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <Router>
          <Layout
            header={
              <LayoutHeader
                appBarProps={{ className: classes.appBar, position: 'static' }}
                
                title={'Policy Builder'}
              />
            }
            body={
              <Switch>
                <Route path={'/builder'} component={Builder} />
                <Route path={'/'} exact component={Home} />
                <Route path={'*'} component={NotFound} />
              </Switch>
            }
            bodyBoxProps={{ paddingX: 4 }}
          />
        </Router>
      </MuiThemeProvider>
    </div>
  )
}
