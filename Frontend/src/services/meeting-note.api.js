import { api } from 'boot/axios'

export const getMeetingNotes = (
  params = {},
) => {
  return api.get(
    '/api/v1/meeting-notes',
    {
      params,
    },
  )
}

export const createMeetingNote = (
  payload,
) => {
  return api.post(
    '/api/v1/meeting-notes',
    payload,
  )
}

export const updateMeetingNote = (
  id,
  payload,
) => {
  return api.put(
    `/api/v1/meeting-notes/${id}`,
    payload,
  )
}