import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import { createAdminObj } from 'components/utils'
import * as jwt from 'services/jwt'
import * as jwtAdmin from 'services/jwt/admin'
import actions from './actions'
import * as selectors from '../selectors'

export function* UPDATE_PROFILE({ payload }) {
  const { accountId, firstName, lastName, contactNumber } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(
    jwtAdmin.updateAdminProfile,
    accountId,
    firstName,
    lastName,
    contactNumber,
  )
  if (response) {
    // console.log('From sagas')
    // console.log(response)
    // console.log('payload')
    // console.log(payload)

    let currentUser = createAdminObj(payload, true, false)
    yield put({
      type: 'user/SET_STATE',
      payload: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        contactNumber: currentUser.contactNumber,
      },
    })
    yield call(jwt.updateLocalUserData, currentUser)
    currentUser = yield select(selectors.admin)
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

export function* CHANGE_PASSWORD({ payload }) {
  const { accountId, newPassword, confirmPassword } = payload

  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const response = yield call(jwtAdmin.updateAdminPassword, accountId, newPassword, confirmPassword)
  if (response) {
    // console.log('From sagas')
    // console.log(response)

    if (response.data.success) {
      notification.success({
        message: 'Password Changed Successfully',
      })
    } else {
      notification.error({
        message: 'Unable to change password at this time',
      })
    }
  }

  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.UPDATE_PROFILE, UPDATE_PROFILE),
    takeEvery(actions.CHANGE_PASSWORD, CHANGE_PASSWORD),
  ])
}
