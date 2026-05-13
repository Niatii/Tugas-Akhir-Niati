export enum MeetingTypeEnum {
  GENERAL = 1,
  DIVISION = 2,
}

export const getMeetingTypeEnumLabel = (
  meetingTypeEnum: MeetingTypeEnum,
) => {
  switch (meetingTypeEnum) {
    case MeetingTypeEnum.GENERAL:
      return "Umum";
    case MeetingTypeEnum.DIVISION:
      return "Divisi";
    default:
      return "Unknown";
  }
};

export const getMeetingTypeEnums = () => {
  const enums = Object.entries(MeetingTypeEnum);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === "number") {
      result.push({
        id: value,
        name: getMeetingTypeEnumLabel(+value),
      });
    }
  }
  return result;
};
