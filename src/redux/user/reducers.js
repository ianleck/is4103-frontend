import actions from './actions'

const initialState = {
  createdAt: '',
  updatedAt: '',
  accountId: '',
  paypalId: '',
  username: '',
  firstName: '',
  lastName: '',
  emailVerified: '',
  email: '',
  contactNumber: '',
  status: '',
  userType: '',
  // frontend specific user attributes
  authorized: process.env.REACT_APP_AUTHENTICATED || false, // false is default value
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
