enum EventRegistrationStatusEnum {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export const getEventRegistrationStatusEnumLabel = (
  statusEnum: EventRegistrationStatusEnum,
) => {
  switch (statusEnum) {
    case EventRegistrationStatusEnum.PENDING:
      return "Pending";
    case EventRegistrationStatusEnum.APPROVED:
      return "Approved";
    case EventRegistrationStatusEnum.REJECTED:
      return "Rejected";
    default:
      return "Unknown";
  }
};

export const getEventRegistrationStatusEnums = () => {
  const enums = Object.entries(EventRegistrationStatusEnum);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === "number") {
      result.push({
        id: value,
        name: getEventRegistrationStatusEnumLabel(+value),
      });
    }
  }
  return result;
};

export default EventRegistrationStatusEnum;
