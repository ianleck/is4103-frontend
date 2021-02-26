import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Avatar, Badge } from 'antd'
import styles from './style.module.scss'

const ProfileMenu = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [count, setCount] = useState(7)
  const history = useHistory()

  const { firstName, lastName, email, contactNumber, userType } = user

  const redirectToLogin = e => {
    e.preventDefault()
    const path = '/auth/login'
    history.push(path)
  }

  const logout = e => {
    e.preventDefault()
    dispatch({
      type: 'user/LOGOUT',
    })
  }

  const editProfile = e => {
    e.preventDefault()
    const path = `/${userType.toLowerCase()}/profile`
    history.push(path)
  }

  const addCount = () => {
    setCount(count + 1)
  }

  const menu = (
    <Menu selectable={false}>
      <Menu.Item>
        <strong>
          <FormattedMessage id="topBar.profileMenu.hello" />,{' '}
          {`${firstName} ${lastName}` || 'Anonymous'}
        </strong>
        <div>
          <strong className="mr-1">
            <FormattedMessage id="topBar.profileMenu.billingPlan" />:{' '}
          </strong>
          From the SENSEI menu bar
        </div>
        <div>
          <strong>
            <FormattedMessage id="topBar.profileMenu.role" />:{' '}
          </strong>
          {userType || '—'}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <div>
          <strong>
            <FormattedMessage id="topBar.profileMenu.email" />:{' '}
          </strong>
          {email || '—'}
          <br />
          <strong>
            <FormattedMessage id="topBar.profileMenu.phone" />:{' '}
          </strong>
          {contactNumber || '—'}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a href="#" onClick={editProfile}>
          <i className="fe fe-user mr-2" />
          <FormattedMessage id="topBar.profileMenu.editProfile" />
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a href="#" onClick={logout}>
          <i className="fe fe-log-out mr-2" />
          <FormattedMessage id="topBar.profileMenu.logout" />
        </a>
      </Menu.Item>
    </Menu>
  )

  const pendingLogin = (
    <Menu selectable={false}>
      <Menu.Item>
        <a href="#" onClick={redirectToLogin}>
          <i className="fe fe-user mr-2" />
          <FormattedMessage id="topBar.profileMenu.login" />
        </a>
      </Menu.Item>
    </Menu>
  )

  if (user.authorized) {
    return (
      <Dropdown overlay={menu} trigger={['click']} onVisibleChange={addCount}>
        <div className={styles.dropdown}>
          <Badge count={count}>
            <Avatar className={styles.avatar} shape="square" size="large" icon={<UserOutlined />} />
          </Badge>
        </div>
      </Dropdown>
    )
  }

  return (
    <Dropdown overlay={pendingLogin} trigger={['click']} onVisibleChange={addCount}>
      <div className={styles.dropdown}>
        <Badge count={count}>
          <Avatar className={styles.avatar} shape="square" size="large" icon={<UserOutlined />} />
        </Badge>
      </div>
    </Dropdown>
  )
}

export default ProfileMenu
