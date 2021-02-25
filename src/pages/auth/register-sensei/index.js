import React from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'
import Register from 'components/Sensei/Auth/Register'
import { USER_TYPE_ENUM } from 'constants/constants'

const RegisterSensei = () => {
  const user = useSelector(state => state.user)

  if (user.authorized && !user.requiresProfileUpdate) {
    switch (user.userType) {
      case USER_TYPE_ENUM.ADMIN:
        return <Redirect to="/admin" />
      case USER_TYPE_ENUM.SENSEI:
        return <Redirect to="/sensei" />
      case USER_TYPE_ENUM.STUDENT:
        return <Redirect to="/" />
      default:
        return <Redirect to="/" />
    }
  }
  return (
    <div>
      <Helmet title="Register" />
      <Register />
    </div>
  )
}

export default RegisterSensei
