import { api } from 'boot/axios'

export const getNotifications = (params = {}) => {
  return api.get('/api/v1/notifications', { params })
}

export const markAllNotificationsAsRead = () => {
  return api.put('/api/v1/notifications/mark-all-as-read')
}

export const markNotificationAsRead = (id) => {
  return api.put(`/api/v1/notifications/${id}/mark-as-read`)
}
