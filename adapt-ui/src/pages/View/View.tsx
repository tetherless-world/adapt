import {
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'
import cytoscape from 'cytoscape'
import dagre from 'cytoscape-dagre'
import { useEffect, useMemo, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { useLocation } from 'react-use'
import { LoadingWrapper } from 'src/components'
import { useGetPolicy } from 'src/hooks/api'
import { convertToGraph } from './helpers'

cytoscape.use(dagre)

export interface ViewProps {}

const useQuery = () => new URLSearchParams(useLocation().search)

const useStyles = makeStyles((theme) => ({
  graphComponent: {
    height: 720,
    width: '100%',
  },
}))

export const View: React.FC<ViewProps> = () => {
  const query = useQuery()
  const history = useHistory()
  const uri = query.get('uri')
  const classes = useStyles()

  if (!uri) {
    history.push('/404')
  }

  const { loading, error, value } = useGetPolicy(uri ?? '')

  const { policy, labelByURI } = value ?? {}

  const { elements } = useMemo(
    () =>
      !!policy && !!labelByURI
        ? convertToGraph(policy, labelByURI)
        : { elements: { nodes: [], edges: [] } },
    [policy, labelByURI]
  )

  const [cyEl, setCyEl] = useState<HTMLElement | null>(null)

  useEffect(() => setCyEl(document.getElementById('cy')))

  const cy =
    !!cyEl &&
    cytoscape({
      container: cyEl,
      elements: elements,
      wheelSensitivity: 0.2,
      layout: {
        // Dagre does not have ts declarations, so it causes errors.
        // @ts-expect-error
        name: 'dagre',
        spacingFactor: 3,
        nodeDimensionIncludesLabels: true,
        nodeSep: 40,
        edgeSep: 40,
        rankDir: 'LR',
        ranker: 'tight-tree',
      },
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'text-valign': 'center',
            shape: 'roundrectangle',
          },
        },
        {
          selector: 'edge',
          style: {
            label: 'data(label)',
            // 'font-size': 10,
            // 'curve-style': 'taxi',
          },
        },
        {
          selector: 'label',
          css: {
            color: '#fff',
            'font-size': 14,
            'text-outline-color': '#000',
            'text-outline-width': 2,
          },
        },
      ],
    })

  return error ? (
    <Redirect to={'/404'} />
  ) : (
    <LoadingWrapper loading={loading}>
      <Grid container spacing={2}>
        <Grid container item>
          <Typography variant={'h4'}>View Policy</Typography>
        </Grid>
        <Grid container item>
          <Grid item xs={12} md={6}>
            <TextField
              label={'Identifier'}
              value={uri}
              margin={'dense'}
              disabled
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} justify={'center'}>
          <Paper
            variant={'outlined'}
            id={'cy'}
            className={classes.graphComponent}
          />
        </Grid>
      </Grid>
    </LoadingWrapper>
  )
}
