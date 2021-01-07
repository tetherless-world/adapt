import { Grid, GridProps } from '@material-ui/core'
import { FormSectionActionRow } from './FormSectionActionRow'
import { FormSectionBody } from './FormSectionBody'
import { FormSectionHeader } from './FormSectionHeader'

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
        <Grid container item {...gridItemProps}>
          {!!header && header}
        </Grid>
        <Grid container item {...gridItemProps}>
          {!!body && body}
        </Grid>
      </Grid>
    </>
  )
}
