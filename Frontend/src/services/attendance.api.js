import { api } from 'boot/axios'

export const getAttendances = (
  meetingId,
) => {
  return api.get(
    `/api/v1/attendances?meeting_id=${meetingId}`,
  )
}

export const updateAttendance = (
  id,
  payload,
) => {
  return api.put(
    `/api/v1/attendances/${id}`,
    payload,
  )
}

export const exportAttendance = (
  meetingId,
) => {
  return api.get(
    `/api/v1/attendances/export/${meetingId}`,
    {
      responseType: 'blob',
    },
  )
}