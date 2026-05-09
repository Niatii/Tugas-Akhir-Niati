enum UserRoleEnum {
  ADMIN = 0,
  COMMITTEE = 1,
}

export const getUserRoleEnumLabel = (userRoleEnum: UserRoleEnum) => {
  switch (userRoleEnum) {
    case UserRoleEnum.ADMIN:
      return "Admin";
    case UserRoleEnum.COMMITTEE:
      return "Committee";
    default:
      return "Unknown";
  }
};

export const getUserRoleEnums = () => {
  const enums = Object.entries(UserRoleEnum);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === "number") {
      result.push({
        id: value,
        name: getUserRoleEnumLabel(+value),
      });
    }
  }
  return result;
};

export default UserRoleEnum;
