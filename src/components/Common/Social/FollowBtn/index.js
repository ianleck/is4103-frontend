import { Button } from 'antd'
import { showNotification } from 'components/utils'
import { FOLLOWING_ENUM, SOCIAL_ACTIONS, USER_TYPE_ENUM } from 'constants/constants'
import { ERROR } from 'constants/notifications'
import { FOLLOW, REQUESTED, UNAVAILABLE, UNFOLLOW } from 'constants/text'
import { isNil } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile } from 'services/user'

const SocialFollowBtn = ({ targetAccountId }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const social = useSelector(state => state.social)

  const [isBlocked, setIsBlocked] = useState(false)

  const checkUserBlocked = async () => {
    if (!isNil(targetAccountId)) {
      if (user.userType === USER_TYPE_ENUM.ADMIN || user.accountId === targetAccountId) {
        setIsBlocked(true)
        return true
      }
      const response = await getProfile(targetAccountId)
      if (response && !isNil(response.isBlocking)) {
        setIsBlocked(response.isBlocking)
        return response.isBlocking
      }
    }
    return false
  }

  const socialAction = actionType => {
    const getAction = () => {
      switch (actionType) {
        case SOCIAL_ACTIONS.FOLLOW:
          return 'social/FOLLOW_USER'
        case SOCIAL_ACTIONS.UNFOLLOW:
          return 'social/UNFOLLOW_USER'
        case SOCIAL_ACTIONS.CANCEL_FOLLOW_REQUEST:
          return 'social/CANCEL_FOLLOW_REQUEST'
        default:
          return ''
      }
    }
    if (
      [
        SOCIAL_ACTIONS.FOLLOW,
        SOCIAL_ACTIONS.UNFOLLOW,
        SOCIAL_ACTIONS.CANCEL_FOLLOW_REQUEST,
      ].indexOf(actionType) !== -1
    ) {
      dispatch({
        type: getAction(),
        payload: {
          targetAccountId,
        },
      })
    }

    getCurrentFollowStatus()
  }

  const getCurrentFollowStatus = () => {
    if (social.pendingFollowingList.findIndex(o => o.followingId === targetAccountId) >= 0) {
      return FOLLOWING_ENUM.PENDING
    }
    if (social.followingList.findIndex(o => o.followingId === targetAccountId) >= 0) {
      return FOLLOWING_ENUM.APPROVED
    }
    if (social.usersBlockedList.findIndex(o => o.followerId === targetAccountId) >= 0) {
      return FOLLOWING_ENUM.BLOCKED
    }
    return false
  }

  const getButtonClassName = () => {
    const followingStatus = getCurrentFollowStatus()
    if (followingStatus === FOLLOWING_ENUM.PENDING) return 'btn btn-default'
    if (followingStatus === FOLLOWING_ENUM.APPROVED) return 'btn btn-primary'
    return 'btn btn-light'
  }

  const getButtonClickHandler = () => {
    const followingStatus = getCurrentFollowStatus()
    if (followingStatus === FOLLOWING_ENUM.PENDING) {
      socialAction(SOCIAL_ACTIONS.CANCEL_FOLLOW_REQUEST)
    } else if (followingStatus === FOLLOWING_ENUM.APPROVED) {
      socialAction(SOCIAL_ACTIONS.UNFOLLOW)
    } else if (followingStatus === FOLLOWING_ENUM.BLOCKED) {
      showNotification('error', ERROR, UNAVAILABLE)
    } else {
      socialAction(SOCIAL_ACTIONS.FOLLOW)
    }
  }

  const getButtonLabel = () => {
    const followingStatus = getCurrentFollowStatus()
    if (followingStatus === FOLLOWING_ENUM.PENDING) return REQUESTED
    if (followingStatus === FOLLOWING_ENUM.APPROVED) return UNFOLLOW
    if (followingStatus === FOLLOWING_ENUM.BLOCKED || isBlocked) return UNAVAILABLE
    return FOLLOW
  }

  const getButtonDisabled = () => {
    const followingStatus = getCurrentFollowStatus()
    if (followingStatus === FOLLOWING_ENUM.BLOCKED) return true
    if (isBlocked) return true
    return false
  }

  useEffect(() => {
    getCurrentFollowStatus()
    checkUserBlocked()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetAccountId])

  return (
    <Button
      block
      className={getButtonClassName()}
      size="large"
      onClick={() => getButtonClickHandler()}
      disabled={getButtonDisabled()}
    >
      {getButtonLabel()}
    </Button>
  )
}

export default SocialFollowBtn
