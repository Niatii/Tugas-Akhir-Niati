import { api } from 'boot/axios'

export const getLandingEvents = () => {
  return api.get('/api/v1/events/landing')
}

export const createEvent = (payload) => {
  return api.post('/api/v1/events', payload)
}

export const getEvents = () => {
  return api.get('/api/v1/events')
}

export const getPublicEvents = () => {
  return api.get('/api/v1/events/public/list')
}

export const getPublicEventById = (id) => {
  return api.get(`/api/v1/events/public/${id}`)
}

export const getMyEvents = () => {
  return api.get('/api/v1/events/my/events')
}

export const getMyEventDetail = (id) => {
  return api.get(`/api/v1/events/my/events/${id}`)
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

export const publishEvent = async (id) => {
  return api.post(`/api/v1/events/${id}/publish`)
}

export const uploadEventImage = (id, file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post(`/api/v1/events/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
