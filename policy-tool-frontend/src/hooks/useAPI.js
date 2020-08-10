import axios from 'axios'
import { useAsyncFn } from 'react-use'

const API_URL_PREFIX = '/api'

const GET = (url) => async () => {
  let { data } = await axios.get(url)
  return data
}

export const useGetDomains = () => {
  let url = `${API_URL_PREFIX}/domains`
  return useAsyncFn(GET(url))
}

export const useGetValidAttributes = () => {
  let url = `${API_URL_PREFIX}/attributes`
  return useAsyncFn(GET(url))
}

export const useGetValidRequestAttributes = () => {
  let url = `${API_URL_PREFIX}/requestattributes`
  return useAsyncFn(GET(url))
}

export const useGetValidConditions = () => {
  let url = `${API_URL_PREFIX}/conditions`
  return useAsyncFn(GET(url))
}

export const useCreatePolicy = () => {
  let url = `${API_URL_PREFIX}/policy`
  return useAsyncFn(async (data) => {
    let response = await axios.post(url, data)
    return response.data
  })
}

export const useCreateRequest = () => {
  let url = `${API_URL_PREFIX}/request`
  return useAsyncFn(async (data) => {
    let response = await axios.post(url, data)
    return response.data
  })
}