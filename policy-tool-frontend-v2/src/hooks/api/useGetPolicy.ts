import { useAsyncFn } from 'react-use'
import { axios } from './common'

export type GetPolicyResponse = string 

const getPolicy = (uri: string, format: string) => async () => {
  let { data } = await axios.get('/policies', { params: { uri } })
  return data
}

export const useGetPolicy = (uri: string, format: string = 'turtle') =>
  useAsyncFn<() => Promise<GetPolicyResponse>>(getPolicy(uri, format), [
    uri,
    format,
  ])
