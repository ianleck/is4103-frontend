import { all, call, putResolve, takeEvery } from 'redux-saga/effects'
import * as jwt from 'services/jwt'
import * as jwtCart from 'services/jwt/cart'
import { showMessage } from 'components/utils'
import { CART_ITEM_REMOVE, CART_COURSE_ADDED, CART_MENTORSHIP_ADDED } from 'constants/notifications'
import { isEmpty, isNil } from 'lodash'
import actions from './actions'

export function* LOAD_CURRENT_CART() {
  const currentUser = yield call(jwt.getLocalUserData)
  if (!isEmpty(currentUser.accessToken)) {
    const result = yield call(jwtCart.getCart)
    const { cart } = result
    yield putResolve({
      type: 'cart/SET_STATE',
      payload: { ...cart },
    })
  }
}

export function* ADD_COURSE_TO_CART({ payload }) {
  const { courseId } = payload
  const response = yield call(jwtCart.addCourseToCart, courseId)
  console.log('response', response)
  if (response && response.success) {
    if (!isNil(response.updatedCart)) {
      yield putResolve({
        type: 'cart/SET_STATE',
        payload: { ...response.updatedCart },
      })
      showMessage('success', CART_COURSE_ADDED)
    }
  }
}

export function* ADD_MENTORSHIP_LISTING_TO_CART({ payload }) {
  const { mentorshipListingId } = payload
  const response = yield call(jwtCart.addMentorshipListingToCart, mentorshipListingId)
  console.log('response', response)
  if (response && response.success) {
    if (!isNil(response.updatedCart)) {
      yield putResolve({
        type: 'cart/SET_STATE',
        payload: { ...response.updatedCart },
      })
      showMessage('success', CART_MENTORSHIP_ADDED)
    }
  }
}

export function* DELETE_FROM_CART({ payload }) {
  const { courseIds, mentorshipListingIds } = payload
  const response = yield call(jwtCart.deleteFromCart, courseIds, mentorshipListingIds)
  if (response && response.success) {
    if (!isNil(response.updatedCart)) {
      yield putResolve({
        type: 'cart/SET_STATE',
        payload: { ...response.updatedCart },
      })
      showMessage('success', CART_ITEM_REMOVE)
    }
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.ADD_COURSE_TO_CART, ADD_COURSE_TO_CART),
    takeEvery(actions.ADD_MENTORSHIP_LISTING_TO_CART, ADD_MENTORSHIP_LISTING_TO_CART),
    takeEvery(actions.DELETE_FROM_CART, DELETE_FROM_CART),
    LOAD_CURRENT_CART(),
  ])
}
