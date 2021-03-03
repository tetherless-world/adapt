import { Grid, GridProps } from '@material-ui/core'

export interface FormSectionActionRowProps {
  actionables: React.ReactNode | React.ReactNodeArray
  gridContainerProps?: GridProps
  gridItemProps?: GridProps
}

export const FormSectionActionRow: React.FC<FormSectionActionRowProps> = ({
  actionables,
  gridContainerProps = {},
  gridItemProps = {},
}) => (
  <Grid container {...gridContainerProps}>
    {(actionables instanceof Array ? actionables : [actionables]).map(
      (actionable) => (
        <Grid item {...gridItemProps}>
          {actionable}
        </Grid>
      )
    )}
  </Grid>
)
