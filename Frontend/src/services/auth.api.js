import { api } from 'boot/axios'

const BASE = '/api/v1/auth'

/**
 * Kirim request lupa kata sandi.
 * Backend akan mengirim email berisi link reset jika email terdaftar.
 * @param {string} email
 */
export const forgotPassword = (email) => {
  return api.post(`${BASE}/forgot-password`, { email })
}

/**
 * Reset kata sandi menggunakan token dari email.
 * @param {string} token - Token dari query param URL
 * @param {string} password - Password baru
 */
export const resetPassword = (token, password) => {
  return api.post(`${BASE}/reset-password`, { token, password })
}
