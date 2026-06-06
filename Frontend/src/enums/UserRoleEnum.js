const UserRoleEnum = {
  ADMIN: 0,
  COMMITTEE: 1,
  COORDINATOR: 2,
}

export const getUserRoleLabel = (role) => {
  switch (role) {
    case UserRoleEnum.ADMIN:
      return 'Admin'
    case UserRoleEnum.COMMITTEE:
      return 'Committee'
    case UserRoleEnum.COORDINATOR:
      return 'Coordinator'
    default:
      return 'Unknown'
  }
}

export default UserRoleEnum