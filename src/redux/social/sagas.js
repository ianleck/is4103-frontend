import { all, call, putResolve, takeEvery } from 'redux-saga/effects'
import { FOLLOWING_ENUM, USER_TYPE_ENUM } from 'constants/constants'
import { isEmpty, isNil } from 'lodash'
import * as jwt from 'services/user'
import * as social from 'services/social'
import { resetSocial, showNotification, sortDescAndKeyFollowershipId } from 'components/utils'
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
  FLW_REQ_ACCEPTED,
  FLW_REQ_ACCEPTED_ERR,
  FLW_REQ_REJECTED,
  FLW_REQ_REJECTED_ERR,
} from 'constants/notifications'
import actions from './actions'

export function* LOAD_CURRENT_SOCIAL() {
  const currentUser = yield call(jwt.getLocalUserData)
  const socialObj = resetSocial
  if (!isEmpty(currentUser.accessToken) && currentUser.userType !== USER_TYPE_ENUM.ADMIN) {
    const followingRsp = yield call(social.getFollowingList, currentUser.accountId)
    if (followingRsp && followingRsp.success) {
      if (!isNil(followingRsp.followingList)) {
        const followingList = sortDescAndKeyFollowershipId(followingRsp.followingList)

        socialObj.followingList = [...followingList]
      }
    }

    const followerRsp = yield call(social.getFollowerList, currentUser.accountId)
    if (followerRsp && followerRsp.success) {
      if (!isNil(followerRsp.followerList)) {
        const followerList = sortDescAndKeyFollowershipId(followerRsp.followerList)

        socialObj.followerList = [...followerList]
      }
    }

    const pendingRsp = yield call(social.getPendingList, currentUser.accountId)
    if (pendingRsp && pendingRsp.success) {
      if (!isNil(pendingRsp.pendingFollowingList)) {
        const pendingFollowingList = sortDescAndKeyFollowershipId(pendingRsp.pendingFollowingList)

        socialObj.pendingFollowingList = [...pendingFollowingList]
      }
    }

    const followRequestRsp = yield call(social.getFollowRequests, currentUser.accountId)
    if (followRequestRsp && followRequestRsp.success) {
      if (!isNil(followRequestRsp.pendingFollowerList)) {
        const pendingFollowerList = sortDescAndKeyFollowershipId(
          followRequestRsp.pendingFollowerList,
        )

        socialObj.pendingFollowerList = [...pendingFollowerList]
      }
    }

    const usersBlockedRsp = yield call(social.getUsersBlocked, currentUser.accountId)
    if (usersBlockedRsp && usersBlockedRsp.success) {
      if (!isNil(usersBlockedRsp.usersBlocked)) {
        const usersBlockedList = sortDescAndKeyFollowershipId(usersBlockedRsp.usersBlocked)

        socialObj.usersBlockedList = [...usersBlockedList]
      }
    }

    yield putResolve({
      type: 'social/SET_STATE',
      payload: { ...socialObj },
    })
  }
}

export function* FOLLOW_USER({ payload }) {
  const { targetAccountId } = payload
  const response = yield call(social.followUser, targetAccountId)
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

export function* ACCEPT_FOLLOW_REQUEST({ payload }) {
  const { targetAccountId } = payload
  const response = yield call(social.acceptFollowRequest, targetAccountId)
  if (response && !isNil(response.success)) {
    showNotification('success', SUCCESS, FLW_REQ_ACCEPTED)
    yield putResolve({
      type: 'social/LOAD_CURRENT_SOCIAL',
    })
  } else {
    showNotification('error', ERROR, FLW_REQ_ACCEPTED_ERR)
  }
}

export function* REJECT_FOLLOW_REQUEST({ payload }) {
  const { targetAccountId } = payload
  const response = yield call(social.rejectFollowRequest, targetAccountId)
  if (response && !isNil(response.success)) {
    showNotification('success', SUCCESS, FLW_REQ_REJECTED)
    yield putResolve({
      type: 'social/LOAD_CURRENT_SOCIAL',
    })
  } else {
    showNotification('error', ERROR, FLW_REQ_REJECTED_ERR)
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
    takeEvery(actions.ACCEPT_FOLLOW_REQUEST, ACCEPT_FOLLOW_REQUEST),
    takeEvery(actions.REJECT_FOLLOW_REQUEST, REJECT_FOLLOW_REQUEST),
    takeEvery(actions.CANCEL_FOLLOW_REQUEST, CANCEL_FOLLOW_REQUEST),
  ])
}
