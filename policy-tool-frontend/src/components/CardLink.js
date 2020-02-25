import React from 'react'
import { Card, CardActionArea, Typography, makeStyles, CardContent, Grid } from "@material-ui/core"
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    minHeight: 100,
    minWidth: 100
  }
}))

export default function CardLink ({ to, text = null }) {
  const classes = useStyles()
  return (
    <Card className={classes.root}>
      <CardActionArea component={Link} to={to}>
        <CardContent className={classes.content}>
          <Grid container justify={'center'} alignContent={'center'}>
            <Grid item>
              <Typography variant={'h5'}>{text || to}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}