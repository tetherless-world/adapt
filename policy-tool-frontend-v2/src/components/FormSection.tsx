import { Grid, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  label: { paddingBottom: theme.spacing(1) },
}))

export interface FormSectionProps {
  label: string
}

export const FormSection: React.FC<FormSectionProps> = ({
  label,
  children,
}) => {
  const classes = useStyles()
  return (
    <>
      <Grid container>
        <Grid item className={classes.label}>
          <Typography variant={'h5'}>{label}</Typography>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </>
  )
}
