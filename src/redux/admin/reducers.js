import actions from './actions'

const initialState = {
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
  authorized: process.env.REACT_APP_AUTHENTICATED || false,
  loading: false,
  requiresProfileUpdate: false,
}

export default function adminReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
