const UserRoleEnum = {
  ADMIN: 0,
  COMMITTEE: 1,
}

export const getUserRoleLabel = (role) => {
  switch (role) {
    case UserRoleEnum.ADMIN:
      return 'Admin'
    case UserRoleEnum.COMMITTEE:
      return 'Committee'
    default:
      return 'Unknown'
  }
}

export default UserRoleEnum