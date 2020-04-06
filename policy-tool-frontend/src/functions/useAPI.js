import axios from 'axios'
import { useAsyncFn } from 'react-use'

const API_URL_PREFIX = '/api'

const makeSimpleGetRequest = (url) => async () => {
  let { data } = await axios.get(url)
  return data
}

export const useGetDomains = () => {
  let url = `${API_URL_PREFIX}/domains`
  return useAsyncFn(makeSimpleGetRequest(url))
}

export const useGetValidAttributes = () => {
  let url = `${API_URL_PREFIX}/attributes`
  return useAsyncFn(makeSimpleGetRequest(url))
}

export const useGetValidConditions = () => {
  let url = `${API_URL_PREFIX}/conditions`
  return useAsyncFn(makeSimpleGetRequest(url))
}
