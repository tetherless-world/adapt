import {
  Grid,
  Typography,
  makeStyles,
  GridProps,
  GridClassKey,
  StandardProps,
  useTheme,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  title: { paddingBottom: theme.spacing(1) },
}))

export interface FormSectionProps
  extends StandardProps<GridProps, GridClassKey> {
  title: string
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  ...props
}) => {
  const theme = useTheme()
  const classes = useStyles(theme)
  return (
    <Grid container {...props}>
      <Grid item className={classes.title}>
        <Typography variant={'h5'}>{title}</Typography>
      </Grid>
      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  )
}
