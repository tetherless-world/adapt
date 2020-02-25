import axios from 'axios'

const baseUrl = '/api'

export default function useApi () {
  return {
    getDomains: async () => {
      let url = `${baseUrl}/domains`
      return axios.get(url)
    },
    constructPolicy: async (data) => {
      let url = `${baseUrl}/policies`
      axios.post(url, data)
    }
  }
}