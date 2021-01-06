import { Grid, Typography, makeStyles, GridProps } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  label: { paddingBottom: theme.spacing(1) },
}))

export interface FormSectionProps extends GridProps {
  label: string
}

export const FormSection: React.FC<FormSectionProps> = ({
  label,
  children,
  ...props
}) => {
  const classes = useStyles()
  return (
    <Grid container {...props}>
      <Grid item className={classes.label}>
        <Typography variant={'h5'}>{label}</Typography>
      </Grid>
      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  )
}
