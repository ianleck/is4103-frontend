import React from 'react'
import { useSelector } from 'react-redux'
import { USER_TYPE_ENUM } from 'constants/constants'
import UserMenu from './UserMenu'
import Cart from '../Cart/CartDropdown'
import style from './style.module.scss'

const UserActionGroup = () => {
  const user = useSelector(state => state.user)

  const checkIfShowCart =
    user.authorized &&
    user.userType !== USER_TYPE_ENUM.ADMIN &&
    user.userType !== USER_TYPE_ENUM.SENSEI

  return (
    <div className={style.userActionGroup}>
      {checkIfShowCart ? (
        <div className="mr-4 d-sm-block">
          <Cart />
        </div>
      ) : null}
      <div className="">
        <UserMenu />
      </div>
    </div>
  )
}

export default UserActionGroup
