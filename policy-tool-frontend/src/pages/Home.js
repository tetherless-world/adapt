import React from 'react'
import { Typography, Grid, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <Grid container spacing={8}>
        <Grid container item justify={'center'}>
          <Typography variant={'h2'}>Welcome to the Policy Builder</Typography>
        </Grid>
        <Grid container justify={'center'} spacing={2}>
          {/* <Grid item>
            <Button
              variant={'outlined'}
              color={'primary'}
              component={Link}
              to={'/domains'}
            >
              Select a domain (WIP)
            </Button>
          </Grid> */}
          <Grid item>
            <Button
              variant={'outlined'}
              color={'primary'}
              component={Link}
              to={'/builder'}
            >
              Create from scratch
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
