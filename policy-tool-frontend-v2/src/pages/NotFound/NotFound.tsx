import React from 'react'
import { Grid, Typography } from '@material-ui/core'

const NotFound: React.FunctionComponent = () => {
    return (
        <Grid container spacing={4}>
            <Grid container item justify={'center'}>
                <Typography variant={'h1'}>404</Typography>
            </Grid>
            <Grid container item justify={'center'}>
                <Typography>Page not found.</Typography>
            </Grid>
        </Grid>
    )
}

export { NotFound }
