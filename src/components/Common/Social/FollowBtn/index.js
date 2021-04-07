import { Button } from 'antd'
import { FOLLOWING_ENUM, SOCIAL_ACTIONS } from 'constants/constants'
import { FOLLOW, REQUESTED, UNFOLLOW } from 'constants/text'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const SocialFollowBtn = ({ targetAccountId }) => {
  const dispatch = useDispatch()
  const social = useSelector(state => state.social)

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
    if (social.pendingFollowingList.findIndex(o => o.followingId === targetAccountId) >= 0)
      return FOLLOWING_ENUM.PENDING
    if (social.followingList.findIndex(o => o.followingId === targetAccountId) >= 0)
      return FOLLOWING_ENUM.APPROVED
    return false
  }

  const DynamicFollowBtn = () => {
    const followingStatus = getCurrentFollowStatus()
    switch (followingStatus) {
      case FOLLOWING_ENUM.PENDING:
        return (
          <Button
            block
            className="btn btn-default"
            size="large"
            onClick={() => socialAction(SOCIAL_ACTIONS.CANCEL_FOLLOW_REQUEST)}
          >
            {REQUESTED}
          </Button>
        )
      case FOLLOWING_ENUM.APPROVED:
        return (
          <Button
            block
            className="btn btn-primary"
            size="large"
            onClick={() => socialAction(SOCIAL_ACTIONS.UNFOLLOW)}
          >
            {UNFOLLOW}
          </Button>
        )
      default:
        return (
          <Button
            block
            className="btn btn-light"
            size="large"
            onClick={() => socialAction(SOCIAL_ACTIONS.FOLLOW)}
          >
            {FOLLOW}
          </Button>
        )
    }
  }

  useEffect(() => {
    getCurrentFollowStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <DynamicFollowBtn />
}

export default SocialFollowBtn
