import { useAsyncFn } from 'react-use'
import { Option } from 'src/global'
import { axios } from './common'

export type GetObligationsResponse = {
  validObligations: Option[]
}

const getObligations = async () => {
  let { data } = await axios.get('/effects')
  return data
}

export const useGetObligations = () =>
  useAsyncFn<() => Promise<GetObligationsResponse>>(getObligations, [])
