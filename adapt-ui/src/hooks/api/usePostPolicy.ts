import { useAsyncFn } from 'react-use'
import { PolicyState } from 'src/types/policy'
import { axios } from './common'

const postPolicy = (policy: PolicyState) => async () => {
  let { data } = await axios.post('/policies', policy)
  return data
}

export const usePostPolicy = (policy: PolicyState) =>
  useAsyncFn<() => Promise<string>>(postPolicy(policy), [policy])
