import actions from './actions'

const initialState = {
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
  authorized: process.env.REACT_APP_AUTHENTICATED || false,
  loading: false,
  requiresProfileUpdate: false,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
