import { notification } from 'antd'
import { all, call, takeEvery } from 'redux-saga/effects'
import {
  createMentorshipListing,
  updateMentorshipListing,
  deleteMentorshipListing,
} from 'services/mentorshipListing'
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

export function* DELETE_LISTING({ payload }) {
  // const { name, description, categories } = payload;
  console.log('called updatrelisting')
  const response = yield call(deleteMentorshipListing, payload.mentorshipListingId)
  if (response) {
    notification.success({
      message: response.message,
    })
  }
}

export function* UPDATE_LISTING({ payload }) {
  // const { name, description, categories } = payload;
  const response = yield call(updateMentorshipListing, payload)
  if (response) {
    notification.success({
      message: response.message,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_LISTING, CREATE_LISTING),
    takeEvery(actions.UPDATE_LISTING, UPDATE_LISTING),
    takeEvery(actions.DELETE_LISTING, DELETE_LISTING),
  ])
}
