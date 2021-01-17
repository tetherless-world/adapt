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
  const format = 'turtle'

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
      <GraphComponent
        data={policy}
        id={'graph-view'}
        config={{
          directed: true,
          nodeHighlightBehavior: true,
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
      ></GraphComponent>
    </LoadingWrapper>
  )
}
