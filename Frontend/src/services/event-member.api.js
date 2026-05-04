import { api } from 'boot/axios'

export const getEventMembers = (eventId) => {
  return api.get(`/api/v1/events/${eventId}`)
}