import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import { USER_TYPE_ENUM } from 'constants/constants'
import { isNil } from 'lodash'
import * as jwt from 'services/jwt'
import { createAdminObj, createUserObj, resetUser } from 'components/utils'
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
    const currentUser = isAdmin
      ? createAdminObj(response, true, false)
      : createUserObj(
          response,
          true,
          false,
          isNil(response.firstName) || isNil(response.lastName) || isNil(response.contactNumber),
        )

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
    yield put({
      type: 'menu/GET_DATA',
    })
  }
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
    const currentUser = createUserObj(response, true, false, true)
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

export function* CHANGE_PASSWORD({ payload }) {
  const { oldPassword, newPassword, confirmPassword } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(jwt.changePassword, oldPassword, newPassword, confirmPassword)
  if (response) {
    notification.success({
      message: 'Password changed successfully.',
    })
  }
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
    const currentUser = createUserObj(
      user,
      user.authorized,
      user.loading,
      user.requiresProfileUpdate,
    )
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
  yield put({
    type: 'user/SET_STATE',
    payload: resetUser,
  })
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
    let currentUser = createUserObj(response, true, false, false)
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
    takeEvery(actions.CHANGE_PASSWORD, CHANGE_PASSWORD),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.UPDATE_PROFILE, UPDATE_PROFILE),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
