import { Dictionary } from 'lodash'
import { useAsyncFn } from 'react-use'
import { AgentRestriction } from 'src/types/restrictions'
import { axios } from './common'

export interface GetRestrictionsResponse {
  validRestrictions: Dictionary<AgentRestriction>
  subclassesByURI: Record<string, string[]>
  labelByURI: Record<string, string>
  sioClassByURI: Record<string, string>
}

const getRestrictions = async () => {
  let { data } = await axios.get('/restrictions')
  return data
}

export const useGetRestrictions = () =>
  useAsyncFn<() => Promise<GetRestrictionsResponse>>(getRestrictions, [])
