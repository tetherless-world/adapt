import axios from 'axios'

const baseUrl = '/api'

export default function useAPI() {
  return {
    getDomains: async () => {
      let url = `${baseUrl}/domains`
      let { data } = await axios.get(url)
      return data
    },
    getValidAttributes: async () => {
      let url = `${baseUrl}/attributes`
      let { data } = await axios.get(url)
      return data
    },
    getConditions: async () => {
      let url = `${baseUrl}/conditions`
      let { data } = await axios.get(url)
      return data
    },
    constructPolicy: async data => {
      let url = `${baseUrl}/policies`
      axios.post(url, data)
    }
  }
}
