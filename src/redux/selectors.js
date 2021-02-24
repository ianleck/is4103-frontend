import { isNil } from 'lodash'

export const user = state => {
  return {
    accountId: state.user.accountId,
    adminVerified: state.user.adminVerified,
    contactNumber: state.user.contactNumber,
    createdAt: state.user.createdAt,
    email: state.user.email,
    emailVerified: state.user.emailVerified,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    paypalId: state.user.paypalId,
    status: state.user.status,
    updatedAt: state.user.updatedAt,
    userType: state.user.userType,
    username: state.user.username,
    authorized: state.user.authorized,
    loading: state.user.loading,
    requiresProfileUpdate: state.user.requiresProfileUpdate,
  }
}
export const settings = state => state.settings
export const accessToken = state => state.accessToken

export const resetUser = {
  accountId: '',
  adminVerified: false,
  contactNumber: '',
  createdAt: '',
  email: '',
  emailVerified: '',
  firstName: '',
  lastName: '',
  paypalId: '',
  status: '',
  updatedAt: '',
  userType: '',
  username: '',
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
    firstName: isNil(currentUser.firstName) ? 'Anonymous' : currentUser.firstName,
    lastName: isNil(currentUser.lastName) ? 'Pigeon' : currentUser.lastName,
    paypalId: currentUser.paypalId,
    status: currentUser.status,
    updatedAt: currentUser.updatedAt,
    userType: currentUser.userType,
    username: currentUser.username,
    authorized: isResponse ? true : currentUser.authorized,
    loading: isResponse ? false : currentUser.loading,
    requiresProfileUpdate: isResponse ? false : currentUser.requiresProfileUpdate,
  }
}
