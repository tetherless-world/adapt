import { useAsyncFn } from 'react-use'
import { Option } from 'src/global'
import { axios } from './common'

export type GetEffectsResponse = {
  validEffects: Option[]
}

const getEffects = async () => {
  let { data } = await axios.get('/effects')
  return data
}

export const useGetEffects = () =>
  useAsyncFn<() => Promise<GetEffectsResponse>>(getEffects, [])
