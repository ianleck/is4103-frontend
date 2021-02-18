import React from 'react'
import Actions from './Actions'
import UserMenu from './UserMenu'
import style from './style.module.scss'

const UserActionGroup = () => {
  return (
    <div className={style.topbar}>
      <div className="mr-4 d-sm-block">
        <Actions />
      </div>
      <div className="">
        <UserMenu />
      </div>
    </div>
  )
}

export default UserActionGroup
