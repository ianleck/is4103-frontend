import React from 'react'
import Search from 'components/Common/Search'
import UserActionGroup from 'components/UserActionGroup'
import style from './style.module.scss'

const UserGroupTopBar = () => {
  return (
    <div className={`${style.topbar} row justify-content-end`}>
      <div className="col text-right pr-0 mr-0 mr-md-4">
        <Search />
      </div>
      <div className="col-auto pl-0">
        <UserActionGroup />
      </div>
    </div>
  )
}

export default UserGroupTopBar
