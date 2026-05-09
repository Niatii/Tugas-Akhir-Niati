enum DivisionMemberRoleEnum {
  COORDINATOR = 1,
  COMMITTEE = 2,
}

export const getDivisionMemberRoleEnumLabel = (
  roleEnum: DivisionMemberRoleEnum
) => {
  switch (roleEnum) {
    case DivisionMemberRoleEnum.COORDINATOR:
      return "Coordinator";
    case DivisionMemberRoleEnum.COMMITTEE:
      return "Committee";
    default:
      return "Unknown";
  }
};

export const getDivisionMemberRoleEnums = () => {
  const enums = Object.entries(DivisionMemberRoleEnum);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === "number") {
      result.push({
        id: value,
        name: getDivisionMemberRoleEnumLabel(+value),
      });
    }
  }
  return result;
};

export default DivisionMemberRoleEnum;
