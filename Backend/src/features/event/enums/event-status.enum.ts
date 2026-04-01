enum EventStatusEnum {
  DRAFT = 0,
  PUBLISHED = 1,
  ONGOING = 2,
  COMPLETED = 3,
  CANCELLED = 4,
}

export const getEventStatusEnumLabel = (eventStatusEnum: EventStatusEnum) => {
  switch (eventStatusEnum) {
    case EventStatusEnum.DRAFT:
      return "Draft";
    case EventStatusEnum.PUBLISHED:
      return "Published";
    case EventStatusEnum.ONGOING:
      return "Ongoing";
    case EventStatusEnum.COMPLETED:
      return "Completed";
    case EventStatusEnum.CANCELLED:
      return "Cancelled";
    default:
      return "Unknown";
  }
};

export const getEventStatusEnums = () => {
  const enums = Object.entries(EventStatusEnum);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === "number") {
      result.push({
        id: value,
        name: getEventStatusEnumLabel(+value),
      });
    }
  }
  return result;
};

export default EventStatusEnum;
