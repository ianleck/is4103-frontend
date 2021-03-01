import { keyBy, map, pick } from 'lodash'
import { all, call, put } from 'redux-saga/effects'
import { getCategories } from 'services/categories'

export function* GET_CATEGORIES() {
  const response = yield call(getCategories)
  if (response) {
    // transforms the response object to have the categoryId as the key and the value to be an object which contains just the categoryId and name
    const payload = keyBy(
      map(response, res => pick(res, ['categoryId', 'name'])),
      'categoryId',
    )
    yield put({ type: 'categories/GET_CATEGORIES', payload })
  }
}

export default function* rootSaga() {
  yield all([GET_CATEGORIES()])
}
