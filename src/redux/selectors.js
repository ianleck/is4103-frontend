import { isNil } from 'lodash'

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

export const resetUser = {
  accountId: '',
  adminVerified: false,
  bio: '',
  contactNumber: '',
  createdAt: '',
  deletedAt: '',
  email: '',
  emailNotification: '',
  emailVerified: false,
  firstName: '',
  headline: '',
  industry: '',
  lastName: '',
  paypalId: '',
  personality: '',
  privacy: '',
  status: '',
  updatedAt: '',
  userType: '',
  username: '',
  // Local Attributes
  authorized: false,
  loading: false,
  requiresProfileUpdate: false,
}

export const resetAdmin = {
  accountId: '',
  contactNumber: '',
  createdAt: '',
  deletedAt: '',
  email: '',
  emailVerified: false,
  firstName: '',
  lastName: '',
  paypalId: '',
  permission: '',
  status: '',
  updatedAt: '',
  userType: '',
  username: '',
  // Local Attributes
  authorized: false,
  loading: false,
  requiresProfileUpdate: false,
}

export const createUserObj = (currentUser, isResponse) => {
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
    authorized: isResponse ? true : currentUser.authorized,
    loading: isResponse ? false : currentUser.loading,
    requiresProfileUpdate:
      isNil(currentUser.firstName) || isNil(currentUser.lastName)
        ? true
        : currentUser.requiresProfileUpdate,
  }
}

export const createAdminObj = (currentAdmin, isResponse) => {
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
    authorized: isResponse ? true : currentAdmin.authorized,
    loading: isResponse ? false : currentAdmin.loading,
  }
}
