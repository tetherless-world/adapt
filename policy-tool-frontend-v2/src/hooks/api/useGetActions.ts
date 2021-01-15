import { useAsyncFn } from 'react-use'
import { Option } from 'src/global'
import { axios } from './common'

export type GetActionsResponse = {
  validActions: Option[]
}

const getActions = async () => {
  let { data } = await axios.get('/actions')
  return data
}

export const useGetActions = () =>
  useAsyncFn<() => Promise<GetActionsResponse>>(getActions, [])
