import React from 'react'
import {
  makeStyles,
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(8),
  },
  appBar: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
  },
  appTitle: {
    flexGrow: 1,
  },
}))

export default function Layout({ title, children }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Container>
        <AppBar className={classes.appBar} position={'static'}>
          <Toolbar>
            <Typography className={classes.appTitle} variant={'h5'}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box paddingX={4}>{children}</Box>
      </Container>
    </div>
  )
}
