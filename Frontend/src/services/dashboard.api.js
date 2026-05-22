import { api } from 'boot/axios'

export const getAdminDashboard = () => {
  return api.get('/api/v1/dashboard/admin')
}
