import React from 'react'
import { useSelector } from 'react-redux'
import { withRouter, Redirect, useLocation } from 'react-router-dom'
import CustomLayout from 'components/CustomLayout'
import { USER_TYPE_ENUM } from 'constants/constants'

const PublicLayout = ({ children }) => {
  const user = useSelector(state => state.user)
  const { pathname } = useLocation()

  if (user.authorized) {
    switch (user.userType) {
      case USER_TYPE_ENUM.ADMIN:
        return <Redirect to="/admin" />
      case USER_TYPE_ENUM.SENSEI:
        if (pathname.includes('/social/')) return <Redirect to={`/sensei${pathname}`} />
        return <Redirect to="/sensei" />
      default:
        break
    }
  }

  return (
    <CustomLayout isPublic maxWidth={/^\/(?=\/|$)/i.test(pathname)}>
      {children}
    </CustomLayout>
  )
}

export default withRouter(PublicLayout)
