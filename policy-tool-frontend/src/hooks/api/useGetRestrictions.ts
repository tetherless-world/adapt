import { useAsyncFn } from 'react-use'
import { OptionMap, Restriction } from 'src/global'
import { axios } from './common'

export interface GetRestrictionsResponse {
  validRestrictions: Restriction[]
  optionsMap: OptionMap
  unitsMap: OptionMap
}

const getRestrictions = async () => {
  let { data } = await axios.get('/restrictions')
  return data
}

export const useGetRestrictions = () =>
  useAsyncFn<() => Promise<GetRestrictionsResponse>>(getRestrictions, [])
