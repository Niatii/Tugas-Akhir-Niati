import { api } from 'boot/axios'

const BASE = (eventId) => `/api/v1/events/${eventId}/certificates`

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Certificate List & Stats
// ─────────────────────────────────────────────────────────────────────────────

export const getCertificatesForEvent = (eventId, params = {}) => {
  return api.get(BASE(eventId), { params })
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Generate
// ─────────────────────────────────────────────────────────────────────────────

export const generateCertificate = (eventId, userId) => {
  return api.post(`${BASE(eventId)}/generate/${userId}`)
}

export const bulkGenerateCertificates = (eventId) => {
  return api.post(`${BASE(eventId)}/bulk-generate`)
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Publish
// ─────────────────────────────────────────────────────────────────────────────

export const publishCertificate = (eventId, certId) => {
  return api.post(`${BASE(eventId)}/${certId}/publish`)
}

export const publishAllCertificates = (eventId) => {
  return api.post(`${BASE(eventId)}/publish-all`)
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Manual Upload
// ─────────────────────────────────────────────────────────────────────────────

export const uploadManualCertificate = (eventId, userId, file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post(`${BASE(eventId)}/upload-manual/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Download
// ─────────────────────────────────────────────────────────────────────────────

export const downloadCertificateAdmin = (eventId, certId) => {
  return api.get(`${BASE(eventId)}/${certId}/download-admin`, { responseType: 'blob' })
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Template CRUD
// ─────────────────────────────────────────────────────────────────────────────

export const getTemplates = (eventId) => {
  return api.get(`${BASE(eventId)}/templates`)
}

export const getTemplate = (eventId, templateId) => {
  return api.get(`${BASE(eventId)}/templates/${templateId}`)
}

export const createTemplate = (eventId, name, backgroundFile = null) => {
  const formData = new FormData()
  formData.append('name', name)
  if (backgroundFile) formData.append('background', backgroundFile)
  return api.post(`${BASE(eventId)}/templates`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const updateTemplate = (eventId, templateId, data, backgroundFile = null) => {
  const formData = new FormData()
  if (data.name !== undefined) formData.append('name', data.name)
  if (data.is_default !== undefined) formData.append('is_default', String(data.is_default))
  if (backgroundFile) formData.append('background', backgroundFile)
  return api.put(`${BASE(eventId)}/templates/${templateId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deleteTemplate = (eventId, templateId) => {
  return api.delete(`${BASE(eventId)}/templates/${templateId}`)
}

export const duplicateTemplate = (eventId, templateId) => {
  return api.post(`${BASE(eventId)}/templates/${templateId}/duplicate`)
}

export const setDefaultTemplate = (eventId, templateId) => {
  return api.post(`${BASE(eventId)}/templates/${templateId}/set-default`)
}

export const saveTemplateFields = (eventId, templateId, fields) => {
  return api.post(`${BASE(eventId)}/templates/${templateId}/fields`, { fields })
}

// ─────────────────────────────────────────────────────────────────────────────
// USER — My Certificates
// ─────────────────────────────────────────────────────────────────────────────

export const getMyCertificates = () => {
  return api.get('/api/v1/certificates/my')
}

export const downloadMyCertificate = (certId) => {
  return api.get(`/api/v1/certificates/${certId}/download`, { responseType: 'blob' })
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — Verification (no auth required)
// ─────────────────────────────────────────────────────────────────────────────

export const verifyCertificate = (certificateNumber) => {
  return api.get(`/api/v1/certificates/verify/${certificateNumber}`)
}
