import { api } from 'boot/axios'

export const updateDivisionMember = (
  divisionId,
  memberId,
  payload,
) => {
  return api.put(
    `/api/v1/divisions/${divisionId}/members/${memberId}`,
    payload,
  )
}