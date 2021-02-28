import { all } from 'redux-saga/effects'
import admin from './admin/sagas'
import user from './user/sagas'
import menu from './menu/sagas'
import settings from './settings/sagas'
import categories from './categories/sagas'

export default function* rootSaga() {
  yield all([admin(), user(), menu(), settings(), categories()])
}
