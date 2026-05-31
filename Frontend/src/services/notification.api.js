import { api } from 'boot/axios'

export const getNotifications = (params = {}) => {
  const mappedParams = { ...params }
  if (mappedParams.sort) {
    mappedParams.order_by = mappedParams.sort
    delete mappedParams.sort
  }
  if (mappedParams.order) {
    mappedParams.direction = mappedParams.order
    delete mappedParams.order
  }
  return api.get('/api/v1/notifications', { params: mappedParams })
}

export const markAllNotificationsAsRead = () => {
  return api.put('/api/v1/notifications/mark-all-as-read')
}

export const markNotificationAsRead = (id) => {
  return api.put(`/api/v1/notifications/${id}/mark-as-read`)
}

export const deleteNotification = (id) => {
  return api.delete(`/api/v1/notifications/${id}`)
}
