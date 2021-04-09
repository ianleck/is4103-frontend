import { MoreOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown, Menu, Modal } from 'antd'
import { getUserFullName, isFollowing, showNotification } from 'components/utils'
import { SUCCESS, USER_BLOCKED } from 'constants/notifications'
import { BLOCK_USER } from 'constants/text'
import { isEmpty, isNil, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFollowerList, getFollowingList, blockUser } from 'services/social'
import SocialFollowBtn from '../FollowBtn'

const SocialProfileCard = ({ user, setCurrentTab, isBlocked }) => {
  const dispatch = useDispatch()

  const currentUser = useSelector(state => state.user)
  const social = useSelector(state => state.social)

  const [followerList, setFollowerList] = useState([])
  const [followingList, setFollowingList] = useState([])

  const [showBlockUserModal, setShowBlockUserModal] = useState(false)

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

  const BlockBtn = () => {
    const BlockMenu = () => {
      return (
        <Menu selectable={false}>
          <Menu.Item danger>
            <a
              target="_blank"
              role="button"
              tabIndex={0}
              onClick={() => setShowBlockUserModal(true)}
              onKeyDown={e => e.preventDefault()}
            >
              Block User
            </a>
          </Menu.Item>
        </Menu>
      )
    }

    return (
      <Dropdown
        overlay={<BlockMenu />}
        trigger={['click']}
        overlayStyle={{ boxShadow: '2px 3px 5px 1px rgba(0, 0, 0, .1)' }}
      >
        <Button
          type="default"
          size="large"
          className="mt-2 mr-2 border-0"
          icon={<MoreOutlined />}
        />
      </Dropdown>
    )
  }

  const blockUserSvc = async () => {
    const response = await blockUser(user.accountId)
    if (response && response.success) {
      dispatch({
        type: 'social/LOAD_CURRENT_SOCIAL',
      })
      showNotification('success', SUCCESS, USER_BLOCKED)
      setShowBlockUserModal(false)
    }
  }

  const BlockUserModalFooter = () => {
    return (
      <div className="row justify-content-between">
        <div className="col-auto">
          <Button type="default" size="large" onClick={() => setShowBlockUserModal(false)}>
            Close
          </Button>
        </div>
        <div className="col-auto">
          <Button type="primary" size="large" onClick={() => blockUserSvc()}>
            {BLOCK_USER}
          </Button>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (
      currentUser.authorized &&
      !isEmpty(user) &&
      (amIFollowingThisUser ||
        !user.isPrivateProfile ||
        currentUser.accountId === user.accountId) &&
      !isBlocked
    )
      getUserSocials()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div className="card">
      <div className="card-header p-0 border-0 overflow-hidden">
        <div className="row pb-0">
          <div className="col-12 text-center">
            {!isBlocked && currentUser.accountId !== user.accountId && (
              <div className="float-right">
                <BlockBtn />
              </div>
            )}
            <h5 className="pt-4 pb-0 pl-5 pr-3">{getUserFullName(user)}</h5>
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
              {(!amIFollowingThisUser &&
                user.isPrivateProfile &&
                currentUser.accountId !== user.accountId) ||
              isBlocked
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
              {(!amIFollowingThisUser &&
                user.isPrivateProfile &&
                currentUser.accountId !== user.accountId) ||
              isBlocked
                ? '-'
                : size(followerList)}
            </h5>
          </div>
        </div>
        {!isBlocked && currentUser.accountId !== user.accountId && (
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
      <Modal
        title="Block User"
        visible={showBlockUserModal}
        centered
        destroyOnClose
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowBlockUserModal(false)}
        footer={<BlockUserModalFooter />}
      >
        Are you sure you want to block this user?
      </Modal>
    </div>
  )
}

export default SocialProfileCard
