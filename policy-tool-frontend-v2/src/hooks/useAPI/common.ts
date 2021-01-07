import axios from 'axios'

const API_URL_PREFIX = '/api'

const axiosInstance = axios.create({ baseURL: API_URL_PREFIX })

export { axiosInstance as axios }
