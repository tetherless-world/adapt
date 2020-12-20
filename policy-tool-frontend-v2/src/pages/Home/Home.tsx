import { Button, Grid, Typography } from "@material-ui/core"
import { Link } from 'react-router-dom'

const Home: React.FunctionComponent = () => {
    return (
        <>
            <Grid container spacing={8}>
                <Grid container item justify={'center'}>
                    <Typography variant={'h2'}>Welcome to the Policy Builder</Typography>
                </Grid>
                <Grid container justify={'center'}>
                    <Grid item>
                        <Button variant={'outlined'} color={'primary'} component={Link} to={'/builder'}>
                            Create from scratch
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export { Home }