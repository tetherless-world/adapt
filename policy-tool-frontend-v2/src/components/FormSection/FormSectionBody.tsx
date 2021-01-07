import { Grid, GridProps } from '@material-ui/core'

export interface FormSectionBodyProps {
  elements: React.ReactNode[]
  gridContainerProps?: GridProps
  gridItemProps?: GridProps
}

export const FormSectionBody: React.FC<FormSectionBodyProps> = ({
  elements,
  gridContainerProps = {},
  gridItemProps = {},
}) => (
  <Grid container {...gridContainerProps}>
    {elements.map((element) => (
      <Grid item {...gridItemProps}>
        {element}
      </Grid>
    ))}
  </Grid>
)
