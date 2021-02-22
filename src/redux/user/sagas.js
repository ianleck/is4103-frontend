import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import * as jwt from 'services/jwt'
import { USER_TYPE_ENUM } from 'constants/constants'
import actions from './actions'
import * as selectors from '../selectors'

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
    const currentUser = {
      accountId: response.accountId,
      contactNumber: response.contactNumber,
      createdAt: response.createdAt,
      email: response.email,
      emailVerified: response.emailVerified,
      firstName: response.firstName,
      lastName: response.lastName,
      paypalId: response.paypalId,
      status: response.status,
      updatedAt: response.updatedAt,
      userType: response.userType,
      username: response.username,
      authorized: true,
    }
    yield put({
      type: 'user/SET_STATE',
      payload: {
        ...currentUser,
      },
    })
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
      description: 'Welcome to Digi Dojo, aspiring student.',
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
  const registerSuccess = yield call(
    jwt.register,
    username,
    email,
    password,
    confirmPassword,
    isStudent,
  )
  if (registerSuccess) {
    yield put({
      type: 'user/TRIGGER_UPDATE_PROFILE',
    })
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

export function* LOGIN_AFT_REGISTRATION({ payload }) {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
  const { email, password } = payload
  const response = yield call(jwt.login, email, password)
  if (response) {
    const currentUser = {
      accountId: response.accountId,
      contactNumber: response.contactNumber,
      createdAt: response.createdAt,
      email: response.email,
      emailVerified: response.emailVerified,
      firstName: response.firstName,
      lastName: response.lastName,
      paypalId: response.paypalId,
      status: response.status,
      updatedAt: response.updatedAt,
      userType: response.userType,
      username: response.username,
      authorized: true,
    }
    yield put({
      type: 'user/SET_STATE',
      payload: {
        ...currentUser,
      },
    })
    notification.success({
      message: 'Welcome to Digi Dojo',
      description: 'Welcome to Digi Dojo, aspiring student.',
    })
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
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
  const user = yield call(jwt.currentAccount)
  if (user) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        accountId: user.accountId,
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
        authorized: user.authorized,
      },
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

export function* TRIGGER_UPDATE_PROFILE() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      requiresProfileUpdate: true,
    },
  })
}

export function* UPDATE_PROFILE() {
  // const { id, firstName, lastName, contactNumber } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  // const success = yield call(jwt.updateProfile, id, firstName, lastName, contactNumber)
  // if (success) {
  //   yield history.push('/')
  //   yield put({
  //     type: 'user/SET_STATE',
  //     payload: {
  //       requiresProfileUpdate: false,
  //     },
  //   })
  //   yield put({
  //     type: 'user/LOAD_CURRENT_ACCOUNT',
  //   })
  //   notification.success({
  //     message: 'Profile Updated Successfully',
  //     description: 'Thanks for telling us more about yourself.',
  //   })
  // }
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
    takeEvery(actions.LOGIN_AFT_REGISTRATION, LOGIN_AFT_REGISTRATION),
    takeEvery(actions.TRIGGER_UPDATE_PROFILE, TRIGGER_UPDATE_PROFILE),
    takeEvery(actions.UPDATE_PROFILE, UPDATE_PROFILE),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
