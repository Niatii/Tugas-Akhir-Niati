enum EventStatusEnum {
  DRAFT = 0,
  UPCOMING = 1,
  REGISTRATION_OPEN = 2,
  REGISTRATION_CLOSED = 3,
  ONGOING = 4,
  COMPLETED = 5,
}

export const getEventStatusEnumLabel = (status: EventStatusEnum) => {
  switch (status) {
    case EventStatusEnum.DRAFT:
      return 'Draft';

    case EventStatusEnum.UPCOMING:
      return 'Menunggu Dibuka';

    case EventStatusEnum.REGISTRATION_OPEN:
      return 'Pendaftaran Dibuka';

    case EventStatusEnum.REGISTRATION_CLOSED:
      return 'Pendaftaran Ditutup';

    case EventStatusEnum.ONGOING:
      return 'Sedang Berlangsung';

    case EventStatusEnum.COMPLETED:
      return 'Selesai';

    default:
      return 'Unknown';
  }
};

export const getEventStatusEnums = () => {
  const enums = Object.entries(EventStatusEnum);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === 'number') {
      result.push({
        id: value,
        name: getEventStatusEnumLabel(+value),
      });
    }
  }
  return result;
};

export default EventStatusEnum;
