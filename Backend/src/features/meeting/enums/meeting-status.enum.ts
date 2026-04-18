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
      return "Scheduled";
    case MeetingStatusEnum.ONGOING:
      return "Ongoing";
    case MeetingStatusEnum.COMPLETED:
      return "Completed";
    case MeetingStatusEnum.CANCELLED:
      return "Cancelled";
    default:
      return "Unknown";
  }
};

export const getMeetingStatusEnums = () => {
  const enums = Object.entries(MeetingStatusEnum);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === "number") {
      result.push({
        id: value,
        name: getMeetingStatusEnumLabel(+value),
      });
    }
  }
  return result;
};

export default MeetingStatusEnum;
