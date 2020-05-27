import React from 'react'
import { CircularProgress, Grid } from '@material-ui/core'

export default function LoadingWrapper({ loading, children }) {
  return (
    <>
      {loading ? (
        <Grid container justify={'center'}>
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      ) : (
        <>{children}</>
      )}
    </>
  )
}
