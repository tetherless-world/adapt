import React from 'react'
import { Container, Typography, CssBaseline } from '@material-ui/core'
import Navigation from './Navigation'
import PolicyCreator from './PolicyCreator'

export default function App () {
  return (
    <>
      <CssBaseline />
      <Container>
        <Navigation title={'Policy Creator'} />
        <PolicyCreator />
      </Container>
    </>
  )
}