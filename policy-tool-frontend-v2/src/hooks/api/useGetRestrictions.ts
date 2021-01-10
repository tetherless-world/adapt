import { useAsyncFn } from 'react-use'
import { axios } from './common'

export const useGetRestrictions = () => {
  return useAsyncFn(async () => {
    let { data } = await axios.get('/restrictions')
    return data
  }, [])
}
