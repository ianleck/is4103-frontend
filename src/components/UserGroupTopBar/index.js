import React from 'react'
import Search from 'components/Common/Search'
import UserActionGroup from 'components/UserActionGroup'
import style from './style.module.scss'

const UserGroupTopBar = () => {
  return (
    <div className={`${style.topbar}`}>
      <div className="row justify-content-end">
        <div className="col-auto mr-2">
          <Search />
        </div>
        <div className="col-auto pl-0">
          <UserActionGroup />
        </div>
      </div>
    </div>
  )
}

export default UserGroupTopBar
