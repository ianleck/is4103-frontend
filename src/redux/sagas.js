import { all } from 'redux-saga/effects'
import cart from './cart/sagas'
import user from './user/sagas'
import menu from './menu/sagas'
import settings from './settings/sagas'
import categories from './categories/sagas'

export default function* rootSaga() {
  yield all([cart(), user(), menu(), settings(), categories()])
}
