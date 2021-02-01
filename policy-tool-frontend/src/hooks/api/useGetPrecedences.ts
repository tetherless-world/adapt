import { useAsyncFn } from 'react-use'
import { Option } from 'src/global'
import { axios } from './common'

export type GetPrecedencesResponse = {
  validPrecedences: Option[]
}

const getPrecedences = async () => {
  let { data } = await axios.get('/precedences')
  return data
}

export const useGetPrecedences = () =>
  useAsyncFn<() => Promise<GetPrecedencesResponse>>(getPrecedences, [])