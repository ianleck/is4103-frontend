import UserActionGroup from 'components/UserActionGroup'
import React from 'react'
import style from './style.module.scss'

const UserGroupTopBar = () => {
  return (
    <div className={style.topbar}>
      <UserActionGroup />
    </div>
  )
}

export default UserGroupTopBar
