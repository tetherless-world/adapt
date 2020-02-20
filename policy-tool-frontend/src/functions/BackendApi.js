import axios from 'axios'

export default function useApi () {
  return {
    constructPolicy: async (data) => axios.get('api/policies', data)
  }
}