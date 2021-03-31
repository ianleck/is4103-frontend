import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { SolutionOutlined, UserOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Avatar } from 'antd'
import { USER_TYPE_ENUM } from 'constants/constants'
import styles from './style.module.scss'

const UserMenu = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const history = useHistory()

  const { firstName, lastName, username, userType } = user

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

  const menu = (
    <Menu selectable={false}>
      <div className="row pt-2 pb-2 pl-3 pr-5">
        <div className="col-12">
          <span className="mb-5">Welcome,</span>
        </div>
        <div className="mt-2 col-12 font-size-18">
          <span className="font-weight-bold">{`${firstName} ${lastName} [${username}]`}</span>
        </div>
      </div>
      <Menu.Divider />
      <div className="row ml-2 pt-2 pb-2 pl-2 pr-5 btn border-0 text-left">
        <div className="col-12 pl-0">
          <span className="mb-5">Following</span>
          <div className="mt-2 font-size-18">
            <span className="font-weight-bold">1090</span>
          </div>
        </div>
      </div>
      <div className="row ml-2 pt-2 pb-2 pl-2 pr-5 btn border-0 text-left">
        <div className="col-12 pl-0">
          <span className="mb-5">Followers</span>
          <div className="mt-2 font-size-18">
            <span className="font-weight-bold">22</span>
          </div>
        </div>
      </div>
      <Menu.Item>
        <a href="#" onClick={viewProfile}>
          <i className="fe fe-user mr-2" />
          My profile
        </a>
      </Menu.Item>
      {user.userType !== USER_TYPE_ENUM.ADMIN && (
        <Menu.Item>
          <a href="#" onClick={() => history.push(`/student/profile`)}>
            <SolutionOutlined className="mr-2" />
            My feed
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
      <Menu.Item>
        <a href="#" onClick={logout}>
          <i className="fe fe-log-out mr-2" />
          <FormattedMessage id="topBar.profileMenu.logout" />
        </a>
      </Menu.Item>
    </Menu>
  )

  const pendingLoginSubMenu = (
    <Menu selectable={false}>
      <Menu.Item>
        <a href="#" onClick={redirectToLogin(false)}>
          <i className="fe fe-user mr-2" />
          Login as Sensei
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a href="/auth/register">
          <i className="fe fe-user mr-2" />
          Sign Up
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

  const PendingLoginMenu = () => {
    return (
      <Dropdown.Button overlay={pendingLoginSubMenu} onClick={redirectToLogin(true)}>
        Login
      </Dropdown.Button>
    )
  }

  if (user.authorized) {
    return (
      <Dropdown overlay={menu} trigger={['click']}>
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
        </div>
      </Dropdown>
    )
  }

  return <PendingLoginMenu />
}

export default UserMenu
