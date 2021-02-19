import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import * as firebase from 'services/firebase'
import * as jwt from 'services/jwt'
import actions from './actions'

const mapAuthProviders = {
  firebase: {
    login: firebase.login,
    register: firebase.register,
    currentAccount: firebase.currentAccount,
    logout: firebase.logout,
    updateProfile: firebase.updateProfile,
  },
  jwt: {
    login: jwt.login,
    register: jwt.register,
    currentAccount: jwt.currentAccount,
    logout: jwt.logout,
    updateProfile: jwt.updateProfile,
  },
}

export function* LOGIN({ payload }) {
  const { email, password } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider: autProviderName } = yield select(state => state.settings)
  const success = yield call(mapAuthProviders[autProviderName].login, email, password)
  if (success) {
    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
    const response = yield call(mapAuthProviders[autProviderName].currentAccount)
    switch (response.role) {
      case 'admin':
        yield history.push('/admin')
        break
      case 'sensei':
        yield history.push('/sensei')
        break
      case 'student':
        yield history.push('/student')
        break
      default:
        break
    }
    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in!',
    })
  }
  if (!success) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* REGISTER({ payload }) {
  const { username, email, password } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider } = yield select(state => state.settings)
  const success = yield call(mapAuthProviders[authProvider].register, username, email, password)
  if (success) {
    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
    const response = yield call(mapAuthProviders[authProvider].currentAccount)
    if (response.userTypeEnum === 'STUDENT') {
      yield put({
        type: 'user/TRIGGER_UPDATE_PROFILE',
      })
    } else {
      yield history.push('/')
    }
    notification.success({
      message: 'Succesful Registered',
      description: 'You have successfully registered!',
    })
  }
  if (!success) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  yield put({
    type: 'menu/GET_DATA',
  })
  const { authProvider } = yield select(state => state.settings)
  const response = yield call(mapAuthProviders[authProvider].currentAccount)
  if (response) {
    const {
      id,
      name,
      avatar,
      role,
      username,
      firstName,
      lastName,
      emailVerified,
      email,
      contactNumber,
      status,
      userTypeEnum,
    } = response
    yield put({
      type: 'user/SET_STATE',
      payload: {
        id,
        name,
        avatar,
        role,
        authorized: true,
        // Add attributes from backend
        username,
        firstName,
        lastName,
        emailVerified,
        email,
        contactNumber,
        status,
        userTypeEnum,
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

export function* LOGOUT() {
  const { authProvider } = yield select(state => state.settings)
  yield call(mapAuthProviders[authProvider].logout)
  yield put({
    type: 'user/SET_STATE',
    payload: {
      id: '',
      name: '',
      role: '',
      email: '',
      avatar: '',
      authorized: false,
      loading: false,
    },
  })
  yield put({
    type: 'menu/GET_DATA',
  })
}

export function* TRIGGER_UPDATE_PROFILE() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  yield put({
    type: 'user/SET_STATE',
    payload: {
      requiresProfileUpdate: true,
    },
  })
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* UPDATE_PROFILE({ payload }) {
  const { id, firstName, lastName, contactNumber } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider: autProviderName } = yield select(state => state.settings)
  const success = yield call(
    mapAuthProviders[autProviderName].updateProfile,
    id,
    firstName,
    lastName,
    contactNumber,
  )
  if (success) {
    yield history.push('/')
    yield put({
      type: 'user/SET_STATE',
      payload: {
        requiresProfileUpdate: false,
      },
    })
    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
    notification.success({
      message: 'Profile Updated Successfully',
      description: 'Thanks for telling us more about yourself.',
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

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.REGISTER, REGISTER),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    takeEvery(actions.TRIGGER_UPDATE_PROFILE, TRIGGER_UPDATE_PROFILE),
    takeEvery(actions.UPDATE_PROFILE, UPDATE_PROFILE),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
