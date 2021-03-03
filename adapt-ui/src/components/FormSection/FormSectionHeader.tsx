import { Grid, GridProps, Typography, TypographyProps } from '@material-ui/core'

export interface FormSectionHeaderProps {
  title: string
  gridProps?: GridProps
  typographyProps?: TypographyProps
}

export const FormSectionHeader: React.FC<FormSectionHeaderProps> = ({
  title,
  gridProps = { style: { paddingBottom: 8 } },
  typographyProps = { variant: 'h5' },
}) => (
  <Grid container item {...gridProps}>
    <Typography {...typographyProps}>{title}</Typography>
  </Grid>
)
