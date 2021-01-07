import { useAsyncFn } from 'react-use'
import { axios } from './common'

export const useGetLabel = (uri: string) => {
  return useAsyncFn(async () => {
    let { data } = await axios.get('/labels', { params: { uri } })
    return data
  }, [])
}

export const useGetDataType = (uri: string) => {
  return useAsyncFn(async () => {
    let { data } = await axios.get('/types', { params: { uri } })
    return data
  }, [])
}

export const useGetOptions = (uri: string) => {
  return useAsyncFn(async () => {
    let { data } = await axios.get('/options', { params: { uri } })
    return data
  }, [])
}

export const useGetRestrictions = () => {
  return useAsyncFn(async () => {
    let { data } = await axios.get('/restrictions')
    return data
  }, [])
}
