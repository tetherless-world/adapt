import { useAsync } from 'react-use'
import { PolicyState } from 'src/types/policy'
import { axios } from './common'

export interface GetPolicyResponse {
  policy: PolicyState
  labelByURI: Record<string, string>
}

const getPolicy = (uuid: string) => async () => {
  let { data } = await axios.get(`/policies/${uuid}`)
  return data
}

export const useGetPolicy = (uuid: string) =>
  useAsync<() => Promise<GetPolicyResponse>>(getPolicy(uuid), [uuid])
