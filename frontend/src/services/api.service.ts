import axios, { GenericAbortSignal } from 'axios'

const API_URL = 'http://localhost:3000/api/v1/user'

export function getUsers(signal: GenericAbortSignal, params?: any) {
  return axios.get(API_URL, { signal, params })
}
