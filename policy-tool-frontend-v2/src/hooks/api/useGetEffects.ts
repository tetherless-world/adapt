import { useAsyncFn } from 'react-use'
import { Option } from '../../global'
import { axios } from './common'

export type GetEffectsResponse = {
  validEffects: Option[]
}

const getEffects = async () => {
  let { data } = await axios.get('/effects')
  return data
}

export const useGetEffects = () => {
  let [response, dispatch] = useAsyncFn<() => Promise<GetEffectsResponse>>(
    getEffects,
    []
  )
  return { response, dispatch }
}
