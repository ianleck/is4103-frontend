import React from 'react'
import { useSelector } from 'react-redux'
import { USER_TYPE_ENUM } from 'constants/constants'
import Actions from './Actions'
import UserMenu from './UserMenu'
import Cart from '../Cart/CartDropdown/Cart'
import style from './style.module.scss'

const UserActionGroup = () => {
  const user = useSelector(state => state.user)

  const checkIfShowCart =
    user.userType !== USER_TYPE_ENUM.ADMIN && user.userType !== USER_TYPE_ENUM.SENSEI

  return (
    <div className={style.userActionGroup}>
      {checkIfShowCart ? (
        <div className="mr-4 d-sm-block">
          <Cart />
        </div>
      ) : null}
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
