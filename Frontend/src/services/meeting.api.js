import { api } from 'boot/axios'

export const createMeeting = (payload) => {
  return api.post('/api/v1/meetings', payload)
}

export const getMeetings = () => {
  return api.get('/api/v1/meetings')
}

export const getMeetingById = (id) => {
  return api.get(`/api/v1/meetings/${id}`)
}

export const updateMeeting = (id, payload) => {
  return api.put(`/api/v1/meetings/${id}`, payload)
}

export const deleteMeeting = (id) => {
  return api.delete(`/api/v1/meetings/${id}`)
}

export const startMeeting = (id) => {
  return api.put(
    `/api/v1/meetings/${id}/start`,
  )
}

export const finishMeeting = (id) => {
  return api.put(
    `/api/v1/meetings/${id}/finish`,
  )
}
