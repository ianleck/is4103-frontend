export const user = state => {
  return {
    accountId: state.user.accountId,
    adminVerified: state.user.adminVerified,
    bio: state.user.bio,
    chatPrivacy: state.user.chatPrivacy,
    contactNumber: state.user.contactNumber,
    createdAt: state.user.createdAt,
    deletedAt: state.user.deletedAt,
    email: state.user.email,
    emailNotification: state.user.emailNotification,
    emailVerified: state.user.emailVerified,
    Experience: state.user.Experience,
    firstName: state.user.firstName,
    headline: state.user.headline,
    industry: state.user.industry,
    isPrivateProfile: state.user.isPrivateProfile,
    lastName: state.user.lastName,
    occupation: state.user.occupation,
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

export const settings = state => state.settings
export const accessToken = state => state.accessToken
