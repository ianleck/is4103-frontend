import React from 'react'
import { Helmet } from 'react-helmet'
import StudentProfileComponent from '../../../../components/Admin/UsersManagement/StudentProfileComponent'

const UserProfile = () => {
  return (
    <div>
      <Helmet title="Student's Page" />
      <StudentProfileComponent />
    </div>
  )
}

export default UserProfile
