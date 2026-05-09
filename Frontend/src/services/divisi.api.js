import { api } from 'boot/axios'

export const getDivisi = () => {
  return api.get('/api/v1/divisions')
}

export const getDivisiById = (id) => {
  return api.get(`/api/v1/divisions/${id}`)
}

export const createDivision = (payload) => {
  return api.post('/api/v1/divisions', payload)
}

export const updateDivision = (id, payload) => {
  return api.put(`/api/v1/divisions/${id}`, payload)
}

export const deleteDivision = (id) => {
  return api.delete(`/api/v1/divisions/${id}`)
}