import { api } from 'boot/axios'

export const createEvent = (payload) => {
  return api.post('/api/v1/events', payload)
}

export const getEvents = () => {
  return api.get('/api/v1/events')
}

export const getEventById = (id) => {
  return api.get(`/api/v1/events/${id}`)
}

export const updateEvent = (id, payload) => {
  return api.put(`/api/v1/events/${id}`, payload)
}

export const deleteEvent = (id) => {
  return api.delete(`/api/v1/events/${id}`)
}