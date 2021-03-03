import { Grid, GridProps } from '@material-ui/core'

export interface FormSectionProps {
  header?: React.ReactNode
  body?: React.ReactNode
  gridContainerProps?: GridProps
  gridItemProps?: GridProps
}

export const FormSection: React.FC<FormSectionProps> = ({
  header,
  body,
  gridContainerProps = {},
  gridItemProps = {},
}) => {
  return (
    <>
      <Grid container {...gridContainerProps}>
        {!!header && (
          <Grid container item {...gridItemProps}>
            {header}
          </Grid>
        )}
        {!!body && (
          <Grid container item {...gridItemProps}>
            {body}
          </Grid>
        )}
      </Grid>
    </>
  )
}
