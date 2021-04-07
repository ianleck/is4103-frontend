import { all, call, putResolve, takeEvery } from 'redux-saga/effects'
import * as jwt from 'services/user'
import * as jwtCart from 'services/cart'
import { showMessage } from 'components/utils'
import {
  CART_ITEM_REMOVE,
  CART_COURSE_ADDED,
  CART_MENTORSHIP_ADDED,
  CART_MENTORSHIP_PASS_UPDATED,
} from 'constants/notifications'
import { USER_TYPE_ENUM } from 'constants/constants'
import { isEmpty, isNil } from 'lodash'
import actions from './actions'

export function* LOAD_CURRENT_CART() {
  const currentUser = yield call(jwt.getLocalUserData)
  if (!isEmpty(currentUser.accessToken) && currentUser.userType === USER_TYPE_ENUM.STUDENT) {
    const response = yield call(jwtCart.getCart)

    if (response && response.success) {
      if (!isNil(response.cart)) {
        const { cart } = response
        yield putResolve({
          type: 'cart/SET_STATE',
          payload: { ...cart },
        })
      }
    }
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

export function* ADD_MENTORSHIP_PASSES_TO_CART({ payload }) {
  const { mentorshipContractId, numSlots } = payload
  const response = yield call(jwtCart.addMentorshipPassToCart, mentorshipContractId, numSlots)
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

export function* UPDATE_MENTORSHIP_PASSES_TO_CART({ payload }) {
  const { cartId, mentorshipListingId, numSlots } = payload
  const response = yield call(
    jwtCart.updateMentorshipPassCount,
    cartId,
    mentorshipListingId,
    numSlots,
  )
  console.log('response', response)
  if (response && response.success) {
    const response2 = yield call(jwtCart.getCart)

    if (response2 && response2.success) {
      if (!isNil(response2.cart)) {
        const { cart } = response2
        yield putResolve({
          type: 'cart/SET_STATE',
          payload: { ...cart },
        })

        showMessage('success', CART_MENTORSHIP_PASS_UPDATED)
      }
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

export function* RESET_CART() {
  const result = yield call(jwtCart.getCart)
  const { cart } = result

  const courses = cart.Courses
  const mentorships = cart.MentorPasses

  let courseIds = []
  let mentorshipListingIds = []

  for (let i = 0; i < courses.length; i += 1) {
    courseIds = [...courseIds, courses[i].courseId]
  }

  for (let i = 0; i < mentorships.length; i += 1) {
    mentorshipListingIds = [...mentorshipListingIds, mentorships[i].mentorshipListingId]
  }

  const response = yield call(jwtCart.deleteFromCart, courseIds, mentorshipListingIds)

  if (response && response.success) {
    if (!isNil(response.updatedCart)) {
      yield putResolve({
        type: 'cart/SET_STATE',
        payload: { ...response.updatedCart },
      })
    }
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_CURRENT_CART, LOAD_CURRENT_CART),
    takeEvery(actions.ADD_COURSE_TO_CART, ADD_COURSE_TO_CART),
    takeEvery(actions.ADD_MENTORSHIP_PASSES_TO_CART, ADD_MENTORSHIP_PASSES_TO_CART),
    takeEvery(actions.UPDATE_MENTORSHIP_PASSES_TO_CART, UPDATE_MENTORSHIP_PASSES_TO_CART),
    takeEvery(actions.DELETE_FROM_CART, DELETE_FROM_CART),
    takeEvery(actions.RESET_CART, RESET_CART),
  ])
}
