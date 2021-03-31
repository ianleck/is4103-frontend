import { all, call, putResolve, takeEvery } from 'redux-saga/effects'
import { FOLLOWING_ENUM, USER_TYPE_ENUM } from 'constants/constants'
import { isEmpty, isNil } from 'lodash'
import * as jwt from 'services/user'
import * as social from 'services/social'
import {
  filterDataByFollowingStatus,
  showNotification,
  sortDescAndKeyFollowingId,
} from 'components/utils'
import {
  ERROR,
  FOLLOW_SUCCESS,
  FOLLOW_ERR,
  SUCCESS,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_ERR,
  FLW_REQ_SUCCESS,
  FLW_REQ_CANCEL_SUCCESS,
  FLW_REQ_CANCEL_ERR,
} from 'constants/notifications'
import actions from './actions'

export function* LOAD_CURRENT_SOCIAL() {
  const currentUser = yield call(jwt.getLocalUserData)
  if (!isEmpty(currentUser.accessToken) && currentUser.userType === USER_TYPE_ENUM.STUDENT) {
    const response = yield call(social.getFollowingList, currentUser.accountId)
    if (response && response.success) {
      if (!isNil(response.followingList)) {
        const pendingAndFollowingList = sortDescAndKeyFollowingId(response.followingList)
        const followingList = filterDataByFollowingStatus(
          pendingAndFollowingList,
          FOLLOWING_ENUM.APPROVED,
        )

        yield putResolve({
          type: 'social/SET_STATE',
          payload: { followingList, pendingAndFollowingList },
        })
      }
    }
  }
}

export function* FOLLOW_USER({ payload }) {
  const { targetAccountId } = payload
  const response = yield call(social.followUser, targetAccountId)
  console.log(response)
  if (response && !isNil(response.followingStatus)) {
    if (response.followingStatus === FOLLOWING_ENUM.APPROVED) {
      showNotification('success', SUCCESS, FOLLOW_SUCCESS)
    } else {
      showNotification('success', SUCCESS, FLW_REQ_SUCCESS)
    }
    yield putResolve({
      type: 'social/LOAD_CURRENT_SOCIAL',
    })
  } else {
    showNotification('error', ERROR, FOLLOW_ERR)
  }
}

export function* UNFOLLOW_USER({ payload }) {
  const { targetAccountId } = payload
  const response = yield call(social.unfollowUser, targetAccountId)
  if (response && !isNil(response.success)) {
    showNotification('success', SUCCESS, UNFOLLOW_SUCCESS)
    yield putResolve({
      type: 'social/LOAD_CURRENT_SOCIAL',
    })
  } else {
    showNotification('error', ERROR, UNFOLLOW_ERR)
  }
}

export function* CANCEL_FOLLOW_REQUEST({ payload }) {
  const { targetAccountId } = payload
  const response = yield call(social.cancelFollowRequest, targetAccountId)
  if (response && !isNil(response.success)) {
    showNotification('success', SUCCESS, FLW_REQ_CANCEL_SUCCESS)
    yield putResolve({
      type: 'social/LOAD_CURRENT_SOCIAL',
    })
  } else {
    showNotification('error', ERROR, FLW_REQ_CANCEL_ERR)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_CURRENT_SOCIAL, LOAD_CURRENT_SOCIAL),
    takeEvery(actions.FOLLOW_USER, FOLLOW_USER),
    takeEvery(actions.UNFOLLOW_USER, UNFOLLOW_USER),
    takeEvery(actions.CANCEL_FOLLOW_REQUEST, CANCEL_FOLLOW_REQUEST),
  ])
}
