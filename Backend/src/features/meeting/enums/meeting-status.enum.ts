enum MeetingStatusEnum {
  SCHEDULED = 0,
  ONGOING = 1,
  COMPLETED = 2,
  CANCELLED = 3,
}

export const getMeetingStatusEnumLabel = (
  meetingStatusEnum: MeetingStatusEnum,
) => {
  switch (meetingStatusEnum) {
    case MeetingStatusEnum.SCHEDULED:
      return 'Akan Datang'

    case MeetingStatusEnum.ONGOING:
      return 'Berlangsung'

    case MeetingStatusEnum.COMPLETED:
      return 'Selesai'

    case MeetingStatusEnum.CANCELLED:
      return 'Dibatalkan'

    default:
      return 'Unknown'
  }
}

export const getMeetingStatusEnums = () => {
  const enums = Object.entries(MeetingStatusEnum)

  const result = []

  for (const [key, value] of enums) {
    if (typeof value === 'number') {
      result.push({
        id: value,
        name: getMeetingStatusEnumLabel(+value),
      })
    }
  }

  return result
}

export default MeetingStatusEnum