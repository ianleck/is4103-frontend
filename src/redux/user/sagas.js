import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import * as jwt from 'services/jwt'
import { USER_TYPE_ENUM } from 'constants/constants'
import actions from './actions'
import * as selectors from '../selectors'

const createUserObj = (user, isResponse) => {
  return {
    accountId: user.accountId,
    adminVerified: user.adminVerified,
    contactNumber: user.contactNumber,
    createdAt: user.createdAt,
    email: user.email,
    emailVerified: user.emailVerified,
    firstName: user.firstName,
    lastName: user.lastName,
    paypalId: user.paypalId,
    status: user.status,
    updatedAt: user.updatedAt,
    userType: user.userType,
    username: user.username,
    authorized: isResponse ? true : user.authorized,
    loading: isResponse ? false : user.loading,
    requiresProfileUpdate: isResponse ? false : user.requiresProfileUpdate,
  }
}

export function* LOGIN({ payload }) {
  const { email, password } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(jwt.login, email, password)
  if (response) {
    const currentUser = createUserObj(response, true)
    yield put({
      type: 'user/SET_STATE',
      payload: {
        ...currentUser,
      },
    })
    yield call(jwt.updateLocalUserData, currentUser)
  }
  const user = yield select(selectors.user)
  if (response) {
    switch (user.userType) {
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
    notification.success({
      message: 'Logged In',
      description: `Welcome to Digi Dojo, ${user.firstName} ${user.lastName}.`,
    })
    yield put({
      type: 'menu/GET_DATA',
    })
  }
  if (!response) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
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
    const currentUser = createUserObj(response, true)
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
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  } else {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  const user = yield call(jwt.getLocalUserData)
  if (user) {
    const currentUser = createUserObj(user, false)
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
    console.log('async yield response: ', response)
    yield put({
      type: 'user/SET_STATE',
      payload: {
        firstName: response.firstName,
        lastName: response.lastName,
        contactNumber: response.contactNumber,
      },
    })
    yield call(jwt.updateLocalUserData, response)
    const currentUser = yield select(selectors.user)
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
