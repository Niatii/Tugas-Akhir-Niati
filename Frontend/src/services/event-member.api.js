import { api } from 'boot/axios'

export const checkMyRegistrationStatus = (eventId) => {
  return api.get('/api/v1/event-registrations/my-status', { params: { event_id: eventId } })
}

export const createEventRegistration = (payload) => {
  return api.post('/api/v1/event-registrations', payload)
}

export const getEventRegistrations = (params = {}) => {
  return api.get('/api/v1/event-registrations', {
    params,
  })
}

export const getEventRegistrationDetail = (id) => {
  return api.get(`/api/v1/event-registrations/${id}`)
}

export const updateEventRegistration = (id, payload) => {
  return api.put(`/api/v1/event-registrations/${id}`, payload)
}