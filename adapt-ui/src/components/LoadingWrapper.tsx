import {
  CircularProgress,
  CircularProgressProps,
  Grid,
  GridProps,
} from '@material-ui/core'

export interface LoadingWrapperProps {
  loading: boolean
  progressProps?: CircularProgressProps
  gridContainerProps?: GridProps
  gridItemProps?: GridProps
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  progressProps = {},
  gridContainerProps = {},
  gridItemProps = {},
  children,
}) =>
  loading ? (
    <Grid container justify={'center'} {...gridContainerProps}>
      <Grid item {...gridItemProps}>
        <CircularProgress {...progressProps} />
      </Grid>
    </Grid>
  ) : (
    <>{children}</>
  )
