import { useAsync } from 'react-use'
import { Option } from 'src/global'
import { axios } from './common'

export type GetPrecedencesResponse = {
  validPrecedences: Option[]
}

const getPrecedences = async () => {
  let { data } = await axios.get('/precedences')
  return data
}

export const useGetPrecedences = () => {
  const { value = { validPrecedences: [] }, ...rest } = useAsync<
    () => Promise<GetPrecedencesResponse>
  >(getPrecedences, [])
  return { value, ...rest }
}
