import actions from './actions'

const initialState = {
  accountId: '',
  adminVerified: false,
  bio: '',
  chatPrivacy: '',
  contactNumber: '',
  createdAt: '',
  cvUrl: '',
  deletedAt: '',
  email: '',
  emailNotification: '',
  emailVerified: false,
  Experience: [],
  firstName: '',
  headline: '',
  industry: '',
  isPrivateProfile: '',
  lastName: '',
  occupation: '',
  paypalId: '',
  permission: '',
  personality: '',
  profileImgUrl: '',
  status: '',
  transcriptUrl: '',
  updatedAt: '',
  userType: '',
  username: '',
  // Local Attributes
  accessToken: '',
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
