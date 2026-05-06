import { api } from 'boot/axios'

export const masterApi = {
  async getJurusan() {
    try {
      const res = await api.get('/jurusan')
      return res.data.data
    } catch (error) {
      console.error('Error getJurusan:', error)
      throw error
    }
  },

  async getProdi() {
    try {
      const res = await api.get('/prodi')
      return res.data.data
    } catch (error) {
      console.error('Error getProdi:', error)
      throw error
    }
  },

  async getProdiByJurusan(jurusan_id) {
    try {
      const res = await api.get(`/prodi/jurusan/${jurusan_id}`)
      return res.data.data
    } catch (error) {
      console.error('Error getProdiByJurusan:', error)
      throw error
    }
  },
}

export const authApi = {
  async registerPanitia(payload) {
    try {
      const res = await api.post('/api/v1/auth/register-panitia', payload)
      return res.data
    } catch (error) {
      console.error('Error register:', error)
      throw error
    }
  },
}
