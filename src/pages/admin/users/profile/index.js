import React from 'react'
import { Helmet } from 'react-helmet'
import UserProfileComponent from 'components/Admin/UsersManagement/UserProfileComponent'

const UserProfile = () => {
  return (
    <div>
      <Helmet title="Student's Page" />
      <UserProfileComponent />
    </div>
  )
}

export default UserProfile
