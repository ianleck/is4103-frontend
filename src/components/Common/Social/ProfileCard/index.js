import { UserOutlined } from '@ant-design/icons'
import { Avatar, Button } from 'antd'
import { isFollowing } from 'components/utils'
import { isEmpty, isNil, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getFollowerList, getFollowingList } from 'services/social'
import SocialFollowBtn from '../FollowBtn'

const SocialProfileCard = ({ user, setCurrentTab }) => {
  const currentUser = useSelector(state => state.user)
  const social = useSelector(state => state.social)

  const [followerList, setFollowerList] = useState([])
  const [followingList, setFollowingList] = useState([])

  const getUserSocials = async () => {
    const followingListRsp = await getFollowingList(user.accountId)
    const followerListRsp = await getFollowerList(user.accountId)

    if (followingListRsp && !isNil(followingListRsp.followingList))
      setFollowingList(followingListRsp.followingList)
    if (followerListRsp && !isNil(followerListRsp.followerList))
      setFollowerList(followerListRsp.followerList)
  }

  const showSocialTab = tabKey => {
    if (!isNil(setCurrentTab)) setCurrentTab(tabKey)
  }

  const amIFollowingThisUser = isFollowing(social.followingList, user.accountId)

  useEffect(() => {
    if (
      !isEmpty(user) &&
      (amIFollowingThisUser || !user.isPrivateProfile || currentUser.accountId === user.accountId)
    )
      getUserSocials()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div className="card">
      <div className="card-header p-0 border-0 overflow-hidden">
        <div className="row pb-0">
          <div className="col-12 text-center">
            <h5 className="pt-4 pb-0 pl-3 pr-3">
              {`${!isNil(user.firstName) ? user.firstName : 'Anonymous'} ${
                !isNil(user.lastName) ? user.lastName : 'Pigeon'
              }`}
            </h5>
          </div>
        </div>
        <img
          src="/resources/images/content/mountains.svg"
          className="social-card-banner"
          alt="Social Banner"
        />
        <div className="social-card-avatar">
          <Avatar
            size={75}
            icon={<UserOutlined />}
            src={user.profileImgUrl ? user.profileImgUrl : '/resources/images/avatars/avatar-2.png'}
          />
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div
            role="button"
            tabIndex={0}
            className="col-6 clickable defocus-btn"
            onClick={() => showSocialTab('following')}
            onKeyDown={e => e.preventDefault()}
          >
            <span>Following</span>
            <br />
            <h5 className="text-dark font-weight-bold">
              {!amIFollowingThisUser &&
              user.isPrivateProfile &&
              currentUser.accountId !== user.accountId
                ? '-'
                : size(followingList)}
            </h5>
          </div>
          <div
            role="button"
            tabIndex={0}
            className="col-6 text-right clickable defocus-btn"
            onClick={() => showSocialTab('follower')}
            onKeyDown={e => e.preventDefault()}
          >
            <span>Followers</span>
            <br />
            <h5 className="text-dark font-weight-bold">
              {!amIFollowingThisUser &&
              user.isPrivateProfile &&
              currentUser.accountId !== user.accountId
                ? '-'
                : size(followerList)}
            </h5>
          </div>
        </div>
        {currentUser.accountId !== user.accountId && (
          <div className="row mt-2">
            <div className="col-12 col-lg-6">
              <SocialFollowBtn targetAccountId={user.accountId} />
            </div>
            <div className="col-12 col-lg-6 mt-2 mt-lg-0">
              <Button block type="default" size="large">
                Message
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SocialProfileCard
