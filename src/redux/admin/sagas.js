import { all, takeEvery, put, putResolve, call } from 'redux-saga/effects'
import { notification } from 'antd'
import * as jwt from 'services/jwt'
import * as jwtAdmin from 'services/jwt/admin'
import actions from './actions'

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
    const currentUser = yield call(jwt.getLocalUserData)
    currentUser.firstName = firstName
    currentUser.lastName = lastName
    currentUser.contactNumber = contactNumber
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        contactNumber: currentUser.contactNumber,
      },
    })
    yield call(jwt.updateLocalUserData, currentUser)
    notification.success({
      message: 'Profile Updated Successfully',
      description: 'Thanks for telling us more about yourself.',
    })
  }
  yield putResolve({
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
