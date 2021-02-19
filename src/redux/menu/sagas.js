import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as jwt from 'services/jwt'
import {
  getPublicMenuData,
  getStudentMenuData,
  getAdminMenuData,
  getSenseiMenuData,
} from 'services/menu'
import actions from './actions'

export function* GET_DATA() {
  const userData = yield call(jwt.currentAccount)
  let isMenuTop = false
  let menuData = []
  switch (userData.userTypeEnum) {
    case 'ADMIN':
      menuData = yield call(getAdminMenuData)
      break
    case 'SENSEI':
      menuData = yield call(getSenseiMenuData)
      break
    case 'STUDENT':
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
