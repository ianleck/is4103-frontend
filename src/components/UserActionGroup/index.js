import React from 'react'
import { useSelector } from 'react-redux'
import Actions from './Actions'
import UserMenu from './UserMenu'
import CartDropdown from '../Cart/CartDropdown'
import style from './style.module.scss'

const UserActionGroup = () => {
  const user = useSelector(state => state.user)

  const checkIfShowCart = user.userType !== 'ADMIN' && user.userType !== 'SENSEI'

  return (
    <div className={style.userActionGroup}>
      {checkIfShowCart ? (
        <div className="mr-4 d-sm-block">
          <CartDropdown />
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
