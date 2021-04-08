import { useAsyncFn } from 'react-use'
import { PolicyState } from 'src/types/policy'
import { axios } from './common'

export interface PostPolicyResponse {
  uuid: string
}

const postPolicy = (policy: PolicyState) => async () => {
  let { data } = await axios.post('/policies', policy)
  return data
}

export const usePostPolicy = (policy: PolicyState) =>
  useAsyncFn<() => Promise<PostPolicyResponse>>(postPolicy(policy), [policy])
