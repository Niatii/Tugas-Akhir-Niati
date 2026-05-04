const UserRoleEnum = {
  ADMIN: 0,
  COORDINATOR: 1,
  COMMITTEE: 2,
}

export const getUserRoleLabel = (role) => {
  switch (role) {
    case UserRoleEnum.ADMIN:
      return 'Admin'
    case UserRoleEnum.COORDINATOR:
      return 'Coordinator'
    case UserRoleEnum.COMMITTEE:
      return 'Committee'
    default:
      return 'Unknown'
  }
}

export default UserRoleEnum