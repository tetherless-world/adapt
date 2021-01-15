import { useAsyncFn } from 'react-use'
import { Option } from 'src/global'
import { axios } from './common'

export type GetPrecedencesResponse = {
  validPrecedences: Option[]
}

const getPrecedences = async () => {
  let { data } = await axios.get('/effects')
  return data
}

export const useGetPrecedences = () => {
  let [response, dispatch] = useAsyncFn<() => Promise<GetPrecedencesResponse>>(
    getPrecedences,
    []
  )
  return { response, dispatch }
}
