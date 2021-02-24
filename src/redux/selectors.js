import { isNil } from 'lodash'

export const user = state => {
  return {
    accountId: state.user.accountId,
    adminVerified: state.user.adminVerified,
    contactNumber: state.user.contactNumber,
    createdAt: state.user.createdAt,
    email: state.user.email,
    emailVerified: state.user.emailVerified,
    firstName: isNil(state.user.firstName) ? 'Anonymous' : state.user.firstName,
    lastName: isNil(state.user.lastName) ? 'Pigeon' : state.user.lastName,
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
