import { api } from 'boot/axios'

export const getPublicOrganization = () => {
  return api.get('/api/v1/users/public/organization')
}