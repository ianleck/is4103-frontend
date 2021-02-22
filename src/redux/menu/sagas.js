import { all, takeEvery, put, call } from 'redux-saga/effects'
import {
  getPublicMenuData,
  getStudentMenuData,
  getAdminMenuData,
  getSenseiMenuData,
} from 'services/menu'
import { USER_TYPE_ENUM } from 'constants/constants'
import actions from './actions'

export function* GET_DATA() {
  let user = localStorage.getItem('user')
  if (user) {
    user = JSON.parse(user)
  }
  if (!user.authorized) {
    user = {
      createdAt: '',
      updatedAt: '',
      accountId: '',
      paypalId: '',
      username: '',
      firstName: '',
      lastName: '',
      emailVerified: '',
      email: '',
      contactNumber: '',
      status: '',
      userType: '',
      authorized: false,
      loading: false,
      requiresProfileUpdate: false,
    }
  }
  let isMenuTop = false
  let menuData = []
  switch (user.userType) {
    case USER_TYPE_ENUM.ADMIN:
      menuData = yield call(getAdminMenuData)
      break
    case USER_TYPE_ENUM.SENSEI:
      menuData = yield call(getSenseiMenuData)
      break
    case USER_TYPE_ENUM.STUDENT:
      isMenuTop = true
      menuData = yield call(getStudentMenuData)
      break
    default:
      isMenuTop = true
      menuData = yield call(getPublicMenuData)
      break
  }
  yield put({
    type: 'menu/SET_STATE',
    payload: {
      menuData,
    },
  })
  yield put({
    type: 'settings/CHANGE_SETTING',
    payload: {
      setting: 'menuLayoutType',
      value: isMenuTop ? 'top' : 'left',
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_DATA, GET_DATA),
    GET_DATA(), // run once on app load to fetch menu data
  ])
}
