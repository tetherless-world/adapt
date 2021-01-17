import { GraphLink, GraphNode } from 'react-d3-graph'
import { useAsyncFn } from 'react-use'
import { axios } from './common'

export type GetPolicyVisualizationResponse = {
  nodes: GraphNode[]
  links: GraphLink[]
}

const getPolicyVisualization = (uri: string) => async () => {
  let { data } = await axios.get('/policies/visualization', { params: { uri } })
  console.log(data)
  return data
}

export const useGetPolicyVisualization = (uri: string) =>
  useAsyncFn<() => Promise<GetPolicyVisualizationResponse>>(
    getPolicyVisualization(uri),
    [uri]
  )
