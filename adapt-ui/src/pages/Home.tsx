import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  body: {
    paddingTop: theme.spacing(8),
  },
}))

export const Home: React.FC = () => {
  const classes = useStyles()
  return (
    <Grid container spacing={4}>
      <Grid container item justify={'center'}>
        <Typography variant={'h1'}>ADAPT</Typography>
      </Grid>
      <Grid container item justify={'center'}>
        <Typography variant={'h4'}>A Domain-Agnostic Policy Tool</Typography>
      </Grid>
      <Grid container justify={'center'} className={classes.body}>
        <Grid item>
          <Button size={'large'} variant={'outlined'} color={'primary'} component={Link} to={'/builder'}>
            Create from Scratch
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
