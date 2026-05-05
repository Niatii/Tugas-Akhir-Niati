import { api } from 'boot/axios'

export const getDivisi = () => {
  return api.get('/api/v1/divisions')
}

export const getDivisiById = (id) => {
  return api.get(`/api/v1/divisions/${id}`)
}