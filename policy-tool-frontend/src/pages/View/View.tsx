import { Grid, Paper, TextField, Typography } from '@material-ui/core'
import { useEffect, useMemo } from 'react'
import { Graph as GraphComponent } from 'react-d3-graph'
import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-use'
import { LoadingWrapper } from 'src/components'
import { useGetPolicyVisualization } from 'src/hooks/api'

export interface ViewProps {}

const useQuery = () => new URLSearchParams(useLocation().search)

export const View: React.FC<ViewProps> = () => {
  const query = useQuery()
  const history = useHistory()
  const uri = query.get('uri')

  if (!uri) {
    history.push('/404')
  }

  const [policyRes, getPolicy] = useGetPolicyVisualization(uri ?? '')

  useEffect(() => void getPolicy(), [getPolicy])

  const policy = useMemo(() => policyRes.value ?? { nodes: [], links: [] }, [
    policyRes,
  ])

  return (
    <LoadingWrapper loading={policyRes?.loading}>
      <Grid container>
        <Grid container item xs={12} justify={'space-between'}>
          <Grid item xs={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant={'h5'}>View Policy</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={'Identifier'}
                  value={uri}
                  disabled
                  margin={'dense'}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Grid container item xs={12} justify={'center'}>
              <Paper variant={'outlined'}>
                <Grid container item xs={12} justify={'center'}>
                  <GraphComponent
                    data={policy}
                    id={'graph-view'}
                    config={{
                      directed: true,
                      nodeHighlightBehavior: true,
                      height: 720,
                      width: 720,
                      node: {
                        labelProperty: (n: any) => n.label,
                        color: 'lightgreen',
                        size: 200,
                        highlightStrokeColor: 'blue',
                      },
                      link: {
                        highlightColor: 'lightblue',
                        renderLabel: false,
                      },
                    }}
                  />
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </LoadingWrapper>
  )
}
