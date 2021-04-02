import { Button } from 'antd'
import { FOLLOW, REQUESTED, UNFOLLOW } from 'constants/text'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const SocialFollowBtn = ({ targetAccountId }) => {
  const dispatch = useDispatch()
  const social = useSelector(state => state.social)

  const socialAction = actionType => {
    const getAction = () => {
      switch (actionType) {
        case 'follow':
          return 'social/FOLLOW_USER'
        case 'unfollow':
          return 'social/UNFOLLOW_USER'
        case 'cancel_follow_request':
          return 'social/CANCEL_FOLLOW_REQUEST'
        default:
          return ''
      }
    }
    if (['follow', 'unfollow', 'cancel_follow_request'].indexOf(actionType) !== -1) {
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
      return 'pending'
    if (social.followingList.findIndex(o => o.followingId === targetAccountId) >= 0)
      return 'following'
    return false
  }

  const getButtonElements = type => {
    const followingStatus = getCurrentFollowStatus()
    switch (followingStatus) {
      case 'pending':
        if (type === 'className') return 'btn btn-default'
        if (type === 'onClick') {
          socialAction('cancel_follow_request')
        }
        if (type === 'buttonLabel') return REQUESTED
        break
      case 'following':
        if (type === 'className') return 'btn btn-primary'
        if (type === 'onClick') {
          socialAction('unfollow')
        }
        if (type === 'buttonLabel') return UNFOLLOW
        break
      default:
        if (type === 'className') return 'btn btn-light'
        if (type === 'onClick') {
          socialAction('follow')
        }
        if (type === 'buttonLabel') return FOLLOW
        break
    }
    return false
  }

  useEffect(() => {
    dispatch({
      type: 'social/LOAD_CURRENT_SOCIAL',
    })
    getCurrentFollowStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Button
      block
      className={getButtonElements('className')}
      size="large"
      onClick={() => getButtonElements('onClick')}
    >
      {getButtonElements('buttonLabel')}
    </Button>
  )
}

export default SocialFollowBtn
