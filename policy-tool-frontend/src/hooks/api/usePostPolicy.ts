import { useAsyncFn } from 'react-use'
import { axios } from './common'

const postPolicy = (policy: any) => async () => {
  let { data } = await axios.post('/policies', policy)
  return data
}

export const usePostPolicy = (policy: any) =>
  useAsyncFn<() => Promise<string>>(postPolicy(policy), [policy])
