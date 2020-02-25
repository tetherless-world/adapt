import React, { useEffect, useState } from 'react'
import { Typography, Grid } from '@material-ui/core'

import CardLink from './CardLink'
import LoadingWrapper from './LoadingWrapper'

import useBackendApi from '../functions/useBackendApi'


export default function DomainSelection () {
  const api = useBackendApi()

  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDomains()
      .then(({ data }) => {
        console.log(data)
        setOptions(data)
      })
      .then(() => {
        setLoading(false)
      })
  }, [])

  return (
    <>
      <LoadingWrapper isLoading={loading}>
        {options.length > 0 ? (
          <Grid container spacing={4} justify={'center'}>
            {options.map(({ title, uri }) => (
              <Grid item key={uri} xs={12} md={4}>
                <CardLink to={`/creator/?uri=${uri}`} text={title} />
              </Grid>
            ))}
          </Grid>
        ) : (
            <Typography variant={'h6'}>No domains found...</Typography>
          )
        }
      </LoadingWrapper>
    </>
  )

}