import { useAsyncFn } from 'react-use'
import { OptionMap, Restriction } from '../../global'
import { axios } from './common'

export interface AttributesResponse {
  validRestrictions: Restriction[]
  optionsMap: OptionMap
  unitsMap: OptionMap
}

export const useGetAttributes = () => {
  return useAsyncFn<() => Promise<AttributesResponse>>(async () => {
    let { data } = await axios.get('/attributes')
    return data
  }, [])
}
