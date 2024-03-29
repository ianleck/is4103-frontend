import actions from './actions'

const initialState = {
  followingList: [],
  followerList: [],
  pendingFollowingList: [],
  pendingFollowerList: [],
  usersBlockedList: [],
}

export default function socialReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
