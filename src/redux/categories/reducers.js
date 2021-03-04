import actions from './actions'

const initialState = {}

export default function categoryReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_CATEGORIES:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
