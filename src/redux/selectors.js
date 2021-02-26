export const user = state => {
  return {
    accountId: state.user.accountId,
    adminVerified: state.user.adminVerified,
    bio: state.user.bio,
    contactNumber: state.user.contactNumber,
    createdAt: state.user.createdAt,
    deletedAt: state.user.deletedAt,
    email: state.user.email,
    emailNotification: state.user.emailNotification,
    emailVerified: state.user.emailVerified,
    firstName: state.user.firstName,
    headline: state.user.headline,
    industry: state.user.industry,
    lastName: state.user.lastName,
    paypalId: state.user.paypalId,
    personality: state.user.personality,
    privacy: state.user.privacy,
    status: state.user.status,
    updatedAt: state.user.updatedAt,
    userType: state.user.userType,
    username: state.user.username,
    // Local Attributes
    authorized: state.user.authorized,
    loading: state.user.loading,
    requiresProfileUpdate: state.user.requiresProfileUpdate,
  }
}

export const admin = state => {
  return {
    accountId: state.admin.accountId,
    contactNumber: state.admin.contactNumber,
    createdAt: state.admin.createdAt,
    deletedAt: state.admin.deletedAt,
    email: state.admin.email,
    emailVerified: state.admin.emailVerified,
    firstName: state.admin.firstName,
    lastName: state.admin.lastName,
    paypalId: state.admin.paypalId,
    permission: state.admin.permission,
    status: state.admin.status,
    updatedAt: state.admin.updatedAt,
    userType: state.admin.adminType,
    username: state.admin.adminname,
    // Local Attributes
    authorized: state.admin.authorized,
    loading: state.admin.loading,
  }
}

export const settings = state => state.settings
export const accessToken = state => state.accessToken
