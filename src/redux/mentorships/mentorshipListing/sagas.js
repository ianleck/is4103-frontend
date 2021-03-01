import { notification } from 'antd'
import { all, call, takeEvery } from 'redux-saga/effects'
import { createMentorshipListing } from 'services/mentorshipListing'
import actions from './actions'

export function* CREATE_LISTING({ payload }) {
  console.log('in create_listing saga')
  const { name, description, categories } = payload
  const response = yield call(createMentorshipListing, name, description, categories)
  if (response) {
    notification.success({
      message: response.message,
    })
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.CREATE_LISTING, CREATE_LISTING)])
}
