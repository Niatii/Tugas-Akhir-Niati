export const EventStatusEnum = {
  DRAFT: 0,
  UPCOMING: 1,
  REGISTRATION_OPEN: 2,
  REGISTRATION_CLOSED: 3,
  ONGOING: 4,
  COMPLETED: 5,
}

// 🔥 LABEL MAP (lebih clean dari switch)
export const statusLabelMap = {
  [EventStatusEnum.DRAFT]: 'Draft',
  [EventStatusEnum.UPCOMING]: 'Menunggu Dibuka',
  [EventStatusEnum.REGISTRATION_OPEN]: 'Pendaftaran Dibuka',
  [EventStatusEnum.REGISTRATION_CLOSED]: 'Pendaftaran Ditutup',
  [EventStatusEnum.ONGOING]: 'Sedang Berlangsung',
  [EventStatusEnum.COMPLETED]: 'Selesai',
}

export const getStatusLabel = (status) => {
  return statusLabelMap[status] || 'Unknown'
}

// 🔥 COLOR MAP
export const statusColorMap = {
  [EventStatusEnum.DRAFT]: 'orange',
  [EventStatusEnum.UPCOMING]: 'grey',
  [EventStatusEnum.REGISTRATION_OPEN]: 'blue',
  [EventStatusEnum.REGISTRATION_CLOSED]: 'deep-orange',
  [EventStatusEnum.ONGOING]: 'indigo',
  [EventStatusEnum.COMPLETED]: 'green',
}

export const getStatusColor = (status) => {
  return statusColorMap[status] || 'grey'
}

// 🔥 OPTIONAL: ICON MAP (biar UI makin hidup)
export const statusIconMap = {
  [EventStatusEnum.DRAFT]: 'edit',
  [EventStatusEnum.UPCOMING]: 'schedule',
  [EventStatusEnum.REGISTRATION_OPEN]: 'how_to_reg',
  [EventStatusEnum.REGISTRATION_CLOSED]: 'block',
  [EventStatusEnum.ONGOING]: 'play_circle',
  [EventStatusEnum.COMPLETED]: 'check_circle',
}

export const getStatusUI = (status) => {
  return {
    label: getStatusLabel(status),
    color: getStatusColor(status),
    icon: statusIconMap[status] || 'help',
  }
}