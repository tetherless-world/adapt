import { useAsyncFn } from 'react-use'
import { Option } from 'src/global'
import { axios } from './common'

export type GetPolicyResponse = {
  validPrecedences: Option[]
}

const getPolicy = (uri: string) => async () => {
  let { data } = await axios.get('/policies', { params: { uri } })
  return data
}

export const useGetPolicy = (uri: string) =>
  useAsyncFn<() => Promise<GetPolicyResponse>>(getPolicy(uri), [uri])
