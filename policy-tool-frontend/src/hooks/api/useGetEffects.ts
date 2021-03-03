import { useAsync } from 'react-use'
import { Option } from 'src/global'
import { axios } from './common'

export type GetEffectsResponse = {
  validEffects: Option[]
}

const getEffects = async () => {
  let { data } = await axios.get('/effects')
  return data
}

export const useGetEffects = () => {
  const { value = { validEffects: [] }, ...rest } = useAsync<
    () => Promise<GetEffectsResponse>
  >(getEffects)
  return { value, ...rest }
}
