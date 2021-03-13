import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Avatar, Badge } from 'antd'
import { USER_TYPE_ENUM } from 'constants/constants'
import styles from './style.module.scss'

const UserMenu = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [count, setCount] = useState(7)
  const history = useHistory()

  const { username, userType } = user

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

  const addCount = () => {
    setCount(count + 1)
  }

  const menu = (
    <Menu selectable={false}>
      <Menu.Item className="pt-2 pb-2 pl-3 pr-5">
        <div className="row">
          <div className="col-12">
            <span className="mb-5">Signed in as</span>
          </div>
          <div className="mt-2 col-12 font-size-18">
            <span className="font-weight-bold">{username}</span>
          </div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a href="#" onClick={viewProfile}>
          <i className="fe fe-user mr-2" />
          Your profile
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a href="#" onClick={viewSettings}>
          <i className="fe fe-settings mr-2" />
          Settings
        </a>
      </Menu.Item>
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
    return '/resources/images/avatars/master.png'
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
      <Dropdown overlay={menu} trigger={['click']} onVisibleChange={addCount}>
        <div className={styles.dropdown}>
          <Badge count={count}>
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
          </Badge>
        </div>
      </Dropdown>
    )
  }

  return <PendingLoginMenu />
}

export default UserMenu
