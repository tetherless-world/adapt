import axios from 'axios'

const baseUrl = '/api'

export default function useBackendApi() {
  return {
    getDomains: async () => {
      let url = `${baseUrl}/domains`
      return await axios.get(url)
    },
    getValidAttributes: async () => {
      let url = `${baseUrl}/attributes`
      return axios.get(url)
    },
    constructPolicy: async data => {
      let url = `${baseUrl}/policies`
      axios.post(url, data)
    }
  }
}
