import React from 'react'
import { useSelector } from 'react-redux'
import Search from 'components/Common/Search'
import UserActionGroup from 'components/UserActionGroup'
import { USER_TYPE_ENUM } from 'constants/constants'
import style from './style.module.scss'

const UserGroupTopBar = () => {
  const user = useSelector(state => state.user)
  return (
    <div className={`${style.topbar}`}>
      <div className="row justify-content-end">
        {user.userType !== USER_TYPE_ENUM.ADMIN && <Search />}
        <div className="col-auto pl-0">
          <UserActionGroup />
        </div>
      </div>
    </div>
  )
}

export default UserGroupTopBar
