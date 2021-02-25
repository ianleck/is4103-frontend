export const resetUser = {
  // Local Attributes
  authorized: false,
  loading: false,
  requiresProfileUpdate: false,
}

export const createUserObj = (currentUser, isAuthorized, isLoading, isProfileUpdateRqd) => {
  return {
    accountId: currentUser.accountId,
    adminVerified: currentUser.adminVerified,
    contactNumber: currentUser.contactNumber,
    createdAt: currentUser.createdAt,
    email: currentUser.email,
    emailVerified: currentUser.emailVerified,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    paypalId: currentUser.paypalId,
    status: currentUser.status,
    updatedAt: currentUser.updatedAt,
    userType: currentUser.userType,
    username: currentUser.username,
    authorized: isAuthorized,
    loading: isLoading,
    requiresProfileUpdate: isProfileUpdateRqd,
  }
}

export const createAdminObj = (currentAdmin, isAuthorized, isLoading) => {
  return {
    accountId: currentAdmin.accountId,
    contactNumber: currentAdmin.contactNumber,
    createdAt: currentAdmin.createdAt,
    deletedAt: currentAdmin.deletedAt,
    email: currentAdmin.email,
    emailVerified: currentAdmin.emailVerified,
    firstName: currentAdmin.firstName,
    lastName: currentAdmin.lastName,
    paypalId: currentAdmin.paypalId,
    permission: currentAdmin.permission,
    status: currentAdmin.status,
    updatedAt: currentAdmin.updatedAt,
    userType: currentAdmin.userType,
    username: currentAdmin.username,
    // Local Attributes
    authorized: isAuthorized,
    loading: isLoading,
  }
}
