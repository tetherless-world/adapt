import {
  AppBar,
  Box,
  Container,
  ContainerClassKey,
  ContainerProps,
  makeStyles,
  StandardProps,
  Toolbar,
  Typography,
  useTheme,
} from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  root: { paddingBottom: theme.spacing(8) },
  appBar: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
  },
  appTitle: { flexGrow: 1 },
}))

export interface LayoutProps
  extends StandardProps<ContainerProps, ContainerClassKey> {
  title: string
}

export const Layout: React.FC<LayoutProps> = ({
  title,
  children,
  ...props
}) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Container {...props}>
      <AppBar className={classes.appBar} position={'static'}>
        <Toolbar>
          <Typography className={classes.appTitle} variant={'h5'}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box paddingX={4}>{children}</Box>
    </Container>
  )
}
