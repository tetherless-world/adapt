import { useAsync } from 'react-use'
import { AgentRestriction } from 'src/types/restrictions'
import { axios } from './common'

export interface GetRestrictionsResponse {
  validRestrictions: Record<string, AgentRestriction>
  subclassesByURI: Record<string, string[]>
  labelByURI: Record<string, string>
  sioClassByURI: Record<string, string>
}

const getRestrictions = async () => {
  let { data } = await axios.get('/restrictions')
  return data
}

export const useGetRestrictions = () => {
  const {
    value = {
      validRestrictions: {},
      subclassesByURI: {},
      labelByURI: {},
      sioClassByURI: {},
    },
    ...rest
  } = useAsync<() => Promise<GetRestrictionsResponse>>(getRestrictions)
  return { value, ...rest }
}
