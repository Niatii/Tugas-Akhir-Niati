export const REGISTRATION_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
}

export const REGISTRATION_STATUS_LABEL = {
  [REGISTRATION_STATUS.PENDING]: 'Menunggu',
  [REGISTRATION_STATUS.APPROVED]: 'Disetujui',
  [REGISTRATION_STATUS.REJECTED]: 'Ditolak',
}

export const REGISTRATION_STATUS_COLOR = {
  [REGISTRATION_STATUS.PENDING]: 'orange',
  [REGISTRATION_STATUS.APPROVED]: 'positive',
  [REGISTRATION_STATUS.REJECTED]: 'negative',
}

export const REGISTRATION_STATUS_OPTIONS = [
  {
    label: 'Semua Status',
    value: 'all',
  },
  ...Object.entries(REGISTRATION_STATUS_LABEL).map(([value, label]) => ({
    label,
    value: Number(value),
  })),
]