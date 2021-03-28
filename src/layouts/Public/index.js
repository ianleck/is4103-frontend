import React from 'react'
import { useSelector } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'
import CustomLayout from 'components/CustomLayout'
import { USER_TYPE_ENUM } from 'constants/constants'

const PublicLayout = ({ children }) => {
  const user = useSelector(state => state.user)
  if (user.authorized) {
    switch (user.userType) {
      case USER_TYPE_ENUM.ADMIN:
        return <Redirect to="/admin" />
      case USER_TYPE_ENUM.SENSEI:
        return <Redirect to="/sensei" />
      default:
        break
    }
  }

  return <CustomLayout isPublic>{children}</CustomLayout>
}

export default withRouter(PublicLayout)
