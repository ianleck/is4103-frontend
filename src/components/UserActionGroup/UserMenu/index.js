import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LockFilled,
  SolutionOutlined,
  StopFilled,
  UserOutlined,
} from '@ant-design/icons'
import { Menu, Dropdown, Avatar, Modal, Button, Empty } from 'antd'
import { USER_TYPE_ENUM } from 'constants/constants'
import { size } from 'lodash'
import SocialFollowingList from 'components/Common/Social/FollowingList'
import FollowerRequestList from 'components/Common/Social/FollowerRequestList'
import UsersBlockedList from 'components/Common/Social/UsersBlockedList'
import { getUserFullName } from 'components/utils'
import styles from './style.module.scss'

const UserMenu = () => {
  const user = useSelector(state => state.user)
  const social = useSelector(state => state.social)
  const numFollowRequests = size(social.pendingFollowerList)
  const numUsersBlocked = size(social.usersBlockedList)

  const dispatch = useDispatch()
  const history = useHistory()

  const { username, userType } = user

  const [showSocialModal, setShowSocialModal] = useState(false)
  const [showFollowingList, setShowFollowingList] = useState(false)

  const [showFollowerRequests, setShowFollowerRequests] = useState(false)
  const [showBlockedUsers, setShowBlockedUsers] = useState(false)

  const redirectToLogin = isStudent => e => {
    e.preventDefault()
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        loginType: isStudent ? USER_TYPE_ENUM.STUDENT : USER_TYPE_ENUM.SENSEI,
      },
    })
    const path = '/auth/login'
    history.push(path)
  }

  const logout = e => {
    e.preventDefault()
    dispatch({
      type: 'user/LOGOUT',
    })
  }

  const viewFeed = e => {
    e.preventDefault()
    if (userType === USER_TYPE_ENUM.STUDENT) history.push(`/social/feed`)
    if (userType === USER_TYPE_ENUM.SENSEI) history.push(`/sensei/social/feed`)
  }

  const viewProfile = e => {
    e.preventDefault()
    const path = `/${userType.toLowerCase()}/profile`
    history.push(path)
  }

  const viewSettings = e => {
    e.preventDefault()
    const path = `/${userType.toLowerCase()}/settings`
    history.push(path)
  }

  const viewSupportPage = e => {
    e.preventDefault()
    const path = `/${userType.toLowerCase()}/support`
    history.push(path)
  }

  const displayFollowerRequests = () => {
    setShowFollowingList(false)
    setShowFollowerRequests(true)
    setShowSocialModal(true)
  }

  const displayFollowerRequestsMenu = () => {
    setShowFollowerRequests(true)
  }

  const displayBlockedUsersMenu = () => {
    setShowBlockedUsers(true)
  }

  const displayFollowingList = type => {
    if (type === 'following') {
      setShowFollowingList(true)
      setShowBlockedUsers(false)
    } else {
      setShowFollowingList(false)
      setShowBlockedUsers(false)
    }
    setShowFollowerRequests(false)
    setShowBlockedUsers(false)
    setShowSocialModal(true)
  }

  const menu = (
    <Menu selectable={false}>
      <div className="row pt-2 pb-2 pl-3 pr-5">
        <div className="col-12">
          <span className="mb-5">Welcome,</span>
        </div>
        <div className="mt-2 col-12 font-size-18">
          <span className="font-weight-bold">{`${getUserFullName(user)} [${username}]`}</span>
        </div>
      </div>
      <Menu.Divider />
      {user.userType !== USER_TYPE_ENUM.ADMIN && (
        <div
          role="button"
          tabIndex={0}
          className="row ml-2 mr-1 pt-2 pb-2 pl-2 pr-5 btn border-0 text-left"
          onClick={() => displayFollowingList('following')}
          onKeyDown={e => e.preventDefault()}
        >
          <div className="col-12 pl-0">
            <span className="mb-5">Following</span>
            <div className="mt-2 font-size-18">
              <span className="font-weight-bold">{size(social.followingList)}</span>
            </div>
          </div>
        </div>
      )}
      {user.userType !== USER_TYPE_ENUM.ADMIN && (
        <div
          role="button"
          tabIndex={0}
          className="row ml-2 mr-2 pt-2 pb-2 pl-2 pr-5 btn border-0 text-left"
          onClick={() => displayFollowingList('followers')}
          onKeyDown={e => e.preventDefault()}
        >
          <div className="col-12 pl-0">
            <span className="mb-5">Followers</span>
            <div className="mt-2 font-size-18">
              <span className="font-weight-bold">{size(social.followerList)}</span>
            </div>
          </div>
        </div>
      )}
      {user.userType !== USER_TYPE_ENUM.ADMIN && (
        <Menu.Item>
          <a href="#" onClick={() => displayFollowerRequests()}>
            <SolutionOutlined className="mr-2" />
            You have {numFollowRequests} follower {numFollowRequests === 1 ? 'request' : 'requests'}
            .
          </a>
        </Menu.Item>
      )}
      {user.userType !== USER_TYPE_ENUM.ADMIN && <Menu.Divider />}
      <Menu.Item>
        <a href="#" onClick={viewProfile}>
          <i className="fe fe-user mr-2" />
          My Profile
        </a>
      </Menu.Item>
      {user.userType !== USER_TYPE_ENUM.ADMIN && (
        <Menu.Item>
          <a href="#" onClick={viewFeed}>
            <SolutionOutlined className="mr-2" />
            My Feed
          </a>
        </Menu.Item>
      )}
      <Menu.Divider />
      {user.userType !== USER_TYPE_ENUM.ADMIN && (
        <Menu.Item>
          <a href="#" onClick={viewSettings}>
            <i className="fe fe-settings mr-2" />
            Settings
          </a>
        </Menu.Item>
      )}
      {user.userType !== USER_TYPE_ENUM.ADMIN && (
        <Menu.Item>
          <a href="#" onClick={viewSupportPage}>
            <i className="fe fe-help-circle mr-2" />
            Request Support
          </a>
        </Menu.Item>
      )}
      {user.userType !== USER_TYPE_ENUM.ADMIN && <Menu.Divider />}
      <Menu.Item>
        <a href="#" onClick={logout}>
          <i className="fe fe-log-out mr-2" />
          <FormattedMessage id="topBar.profileMenu.logout" />
        </a>
      </Menu.Item>
    </Menu>
  )

  const GetDefaultProfilePic = () => {
    if (user.userType === USER_TYPE_ENUM.STUDENT) {
      return '/resources/images/avatars/apprentice.png'
    }
    if (user.userType === USER_TYPE_ENUM.SENSEI) {
      return '/resources/images/avatars/master.png'
    }
    return '/resources/images/avatars/administrator.png'
  }

  const pendingLoginSubMenu = (
    <Menu selectable={false}>
      <Menu.Item>
        <a href="#" onClick={redirectToLogin(false)}>
          <i className="fe fe-user mr-2" />
          Login as Sensei
        </a>
      </Menu.Item>
    </Menu>
  )

  const PendingLoginMenu = () => {
    return (
      <div className="row">
        <div className="col-auto">
          <Dropdown.Button
            type="default"
            overlay={pendingLoginSubMenu}
            onClick={redirectToLogin(true)}
            size="large"
          >
            Login
          </Dropdown.Button>
        </div>
        <div className="col-auto pl-0">
          <Button type="default" size="large" onClick={() => history.push(`/auth/register`)}>
            Sign up
          </Button>
        </div>
      </div>
    )
  }

  const SocialModalFooter = () => {
    return (
      <div className="row align-items-center">
        <div className="col-auto">
          <Button type="default" size="large" onClick={() => setShowSocialModal(false)}>
            Close
          </Button>
        </div>
      </div>
    )
  }

  if (user.authorized) {
    return (
      <Dropdown overlay={menu}>
        <div className={styles.dropdown}>
          <Avatar
            src={
              user.profileImgUrl
                ? `${user.profileImgUrl}?${new Date().getTime()}`
                : GetDefaultProfilePic()
            }
            className={styles.avatar}
            shape="square"
            size="large"
            icon={<UserOutlined />}
          />
          <Modal
            title={`${showFollowingList ? 'Following' : 'Follower'} List`}
            visible={showSocialModal}
            cancelText="Close"
            centered
            okButtonProps={{ style: { display: 'none' } }}
            onCancel={() => setShowSocialModal(false)}
            footer={<SocialModalFooter />}
            zIndex="1051"
          >
            {!showFollowerRequests && !showBlockedUsers && (
              <div
                role="button"
                tabIndex={0}
                className="text-dark btn btn-block text-left border-0 pl-0 d-flex justify-content-between align-items-center"
                onClick={() => displayFollowerRequestsMenu()}
                onKeyDown={e => e.preventDefault()}
              >
                <span className="font-weight-bold font-size-18">
                  <LockFilled />
                  &nbsp;&nbsp;Follow requests ({numFollowRequests})
                </span>
                <ArrowRightOutlined className="float-right" />
              </div>
            )}
            {!showFollowerRequests && !showBlockedUsers && (
              <>
                <div
                  role="button"
                  tabIndex={0}
                  className="text-dark btn btn-block text-left border-0 mt-2 pl-0 d-flex justify-content-between align-items-center"
                  onClick={() => displayBlockedUsersMenu()}
                  onKeyDown={e => e.preventDefault()}
                >
                  <span className="font-weight-bold font-size-18">
                    <StopFilled />
                    &nbsp;&nbsp;Blocked users ({numUsersBlocked})
                  </span>
                  <ArrowRightOutlined className="float-right" />
                </div>
                <hr className="mb-4" />
              </>
            )}
            {!showFollowerRequests && !showBlockedUsers && (
              <div className="following-list-container">
                <SocialFollowingList
                  followingList={showFollowingList ? social.followingList : social.followerList}
                  isFollowingList={showFollowingList}
                  isOwnList
                  setShowSocialModal={setShowSocialModal}
                />
              </div>
            )}

            {showFollowerRequests && !showBlockedUsers && (
              <div className="following-list-container">
                <div className="row pt-2">
                  <div className="col-4 mb-4">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      icon={<ArrowLeftOutlined />}
                      onClick={() => setShowFollowerRequests(false)}
                    >
                      Back
                    </Button>
                  </div>
                </div>
                {numFollowRequests === 0 && <Empty />}
                {numFollowRequests > 0 && (
                  <FollowerRequestList
                    pendingFollowerList={social.pendingFollowerList}
                    setShowSocialModal={setShowSocialModal}
                  />
                )}
              </div>
            )}
            {showBlockedUsers && (
              <div className="following-list-container">
                <div className="row pt-2">
                  <div className="col-4 mb-4">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      icon={<ArrowLeftOutlined />}
                      onClick={() => setShowBlockedUsers(false)}
                    >
                      Back
                    </Button>
                  </div>
                </div>
                {numUsersBlocked === 0 && <Empty />}
                {numUsersBlocked > 0 && (
                  <UsersBlockedList
                    usersBlockedList={social.usersBlockedList}
                    setShowSocialModal={setShowSocialModal}
                  />
                )}
              </div>
            )}
          </Modal>
        </div>
      </Dropdown>
    )
  }

  return <PendingLoginMenu />
}

export default UserMenu
