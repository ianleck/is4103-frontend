import actions from './actions'

const initialState = {
  createdAt: '',
  updatedAt: '',
  cartId: '',
  studentId: '',
  deletedAt: null,
  Course: [],
  MentorshipApplications: [],
}

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
