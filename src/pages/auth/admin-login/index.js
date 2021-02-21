import React from 'react'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login from 'components/cleanui/system/Auth/Login'
import { USER_TYPE_ENUM } from 'constants/constants'

const AdminLogin = () => {
  const user = useSelector(state => state.user)
  if (user.authorized && user.userTypeEnum === USER_TYPE_ENUM.ADMIN) {
    return <Redirect to="/admin" />
  }
  return (
    <div>
      <Helmet title="Admin Login" />
      <Login />
    </div>
  )
}

export default AdminLogin
