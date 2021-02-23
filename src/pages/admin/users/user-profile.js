import React from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import UserProfileComponent from '../../../components/Admin/UsersManagement/UserProfileComponent'

const UserProfile = () => {
  const { userId } = useParams()

  return (
    <div>
      <Helmet title="Mentor's Page" />
      <div className="cui__utils__heading">
        <strong>User ID: {userId}</strong>
      </div>

      <UserProfileComponent />
    </div>
  )
}

export default UserProfile
