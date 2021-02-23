export const user = state => state.user
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
