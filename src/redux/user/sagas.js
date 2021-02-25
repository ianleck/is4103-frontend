import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import { USER_TYPE_ENUM } from 'constants/constants'
import { isNil } from 'lodash'
import * as jwt from 'services/jwt'
import actions from './actions'
import * as selectors from '../selectors'

export function* LOGIN({ payload }) {
  const { email, password, isAdmin } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(jwt.login, email, password, isAdmin)
  if (response) {
    const currentUser = selectors.createUserObj(response, true)
    yield put({
      type: 'user/SET_STATE',
      payload: {
        ...currentUser,
      },
    })
    yield call(jwt.updateLocalUserData, currentUser)
    switch (currentUser.userType) {
      case USER_TYPE_ENUM.ADMIN:
        yield history.push('/admin')
        break
      case USER_TYPE_ENUM.SENSEI:
        yield history.push('/sensei')
        break
      case USER_TYPE_ENUM.STUDENT:
        yield history.push('/')
        break
      default:
        yield history.push('/')
        break
    }
    if (isNil(currentUser.firstName)) currentUser.firstName = 'Anonymous'
    if (isNil(currentUser.lastName)) currentUser.lastName = 'Pigeon'
    notification.success({
      message: 'Logged In',
      description: `Welcome to Digi Dojo, ${currentUser.firstName} ${currentUser.lastName}.`,
    })
  }
  yield put({
    type: 'menu/GET_DATA',
  })
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* REGISTER({ payload }) {
  const { username, email, password, confirmPassword, isStudent } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(jwt.register, username, email, password, confirmPassword, isStudent)
  if (response) {
    const currentUser = selectors.createUserObj(response, true)
    currentUser.requiresProfileUpdate = true
    yield put({
      type: 'user/SET_STATE',
      payload: {
        ...currentUser,
      },
    })
    yield call(jwt.updateLocalUserData, currentUser)
    notification.success({
      message: 'Account created successfully.',
      description: 'Let us know more about you!',
    })
  }
  yield put({
    type: 'menu/GET_DATA',
  })
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOAD_CURRENT_ACCOUNT() {
  const user = yield call(jwt.getLocalUserData)
  if (user) {
    const currentUser = selectors.createUserObj(user, false)
    yield put({
      type: 'user/SET_STATE',
      payload: currentUser,
    })
  }
  yield put({
    type: 'menu/GET_DATA',
  })
}

export function* LOGOUT() {
  yield call(jwt.logout)
  window.location.reload()
}

export function* UPDATE_PROFILE({ payload }) {
  const { accountId, firstName, lastName, contactNumber, isStudent } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(
    jwt.updateProfile,
    accountId,
    firstName,
    lastName,
    contactNumber,
    isStudent,
  )
  if (response) {
    let currentUser = selectors.createUserObj(response, true)
    yield put({
      type: 'user/SET_STATE',
      payload: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        contactNumber: currentUser.contactNumber,
      },
    })
    yield call(jwt.updateLocalUserData, currentUser)
    currentUser = yield select(selectors.user)
    if (currentUser.requiresProfileUpdate) {
      currentUser.requiresProfileUpdate = false
      yield call(jwt.updateLocalUserData, currentUser)
      yield put({
        type: 'user/SET_STATE',
        payload: {
          requiresProfileUpdate: false,
        },
      })
      yield history.push('/')
      notification.success({
        message: 'Profile Updated Successfully',
        description: 'Thanks for telling us more about yourself.',
      })
    } else {
      notification.success({
        message: 'Profile Updated Successfully',
        description: 'We have received your new personal information.',
      })
    }
  }
  yield put({
    type: 'menu/GET_DATA',
  })
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.REGISTER, REGISTER),
    takeEvery(actions.LOGOUT, LOGOUT),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.UPDATE_PROFILE, UPDATE_PROFILE),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
