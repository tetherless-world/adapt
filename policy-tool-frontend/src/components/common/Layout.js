import React from 'react'
import {
  makeStyles,
  CssBaseline,
  Container,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core'
import Navigation from './Navigation'

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(8)
  }
}))

const theme = createMuiTheme({
  props: {
    MuiButton: {
      size: 'small',
      variant: 'outlined',
      color: 'primary'
    }
  }
})

export default function Layout({ title, children }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <Navigation title={title} />
          {children}
        </Container>
      </MuiThemeProvider>
    </div>
  )
}
