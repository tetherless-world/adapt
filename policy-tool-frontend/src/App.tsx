import {
  AppBar,
  Box,
  CssBaseline,
  makeStyles,
  MuiThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import { Layout, LayoutHeader } from './components'
import { Builder, Home, NotFound, View } from './pages'
import { theme } from './theme'

const useStyles = makeStyles((theme) => ({
  appBar: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
  },
  appTitle: {
    textDecoration: 'none',
    color: 'unset',
  },
}))

export const App: React.FC = () => {
  const classes = useStyles(theme)

  const Header = () => (
    <AppBar position={'static'} className={classes.appBar}>
      <Toolbar>
        <Typography
          variant={'h5'}
          component={Link}
          to={'/'}
          className={classes.appTitle}
        >
          ADAPT
        </Typography>
      </Toolbar>
    </AppBar>
  )

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout
            header={<Header />}
            body={
              <Box paddingX={4}>
                <Switch>
                  <Route path={'/builder'} component={Builder} />
                  <Route path={'/view'} component={View} />
                  <Route path={'/'} exact component={Home} />
                  <Route path={'*'} component={NotFound} />
                </Switch>
              </Box>
            }
          />
        </Router>
      </MuiThemeProvider>
    </div>
  )
}
