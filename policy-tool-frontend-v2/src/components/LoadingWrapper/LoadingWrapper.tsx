import { CircularProgress, Grid } from '@material-ui/core'

export interface LoadingWrapperProps {
  loading: boolean
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  children,
}) => (
  <>
    {loading ? (
      <Grid container justify={'center'}>
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    ) : (
      <>{children}</>
    )}
  </>
)
