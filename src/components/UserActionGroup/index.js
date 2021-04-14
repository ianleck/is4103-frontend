import React from 'react'
import { useSelector } from 'react-redux'
import { USER_TYPE_ENUM } from 'constants/constants'
import UserMenu from './UserMenu'
import Cart from '../Cart/CartDropdown'
import style from './style.module.scss'
import ChatAction from './Chat'

const UserActionGroup = () => {
  const user = useSelector(state => state.user)

  const checkIfShowCart =
    user.authorized &&
    user.userType !== USER_TYPE_ENUM.ADMIN &&
    user.userType !== USER_TYPE_ENUM.SENSEI

  return (
    <div className={`${style.userActionGroup} pr-4`}>
      {user.authorized && user.userType !== USER_TYPE_ENUM.ADMIN && (
        <div className="pr-4">
          <ChatAction />
        </div>
      )}
      {checkIfShowCart && (
        <div className="pr-4">
          <Cart />
        </div>
      )}

      <div>
        <UserMenu />
      </div>
    </div>
  )
}

export default UserActionGroup
