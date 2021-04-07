import { all } from 'redux-saga/effects'
import cart from './cart/sagas'
import categories from './categories/sagas'
import menu from './menu/sagas'
import settings from './settings/sagas'
import social from './social/sagas'
import user from './user/sagas'

export default function* rootSaga() {
  yield all([cart(), categories(), menu(), settings(), social(), user()])
}
