import React from 'react'
import { Helmet } from 'react-helmet'
import MyAdminProfile from '../../../components/Admin/MyAdminProfile/MyAdminProfile'

const AdminProfile = () => {
  return (
    <div>
      <Helmet title="Mentor's Page" />
      <div className="cui__utils__heading">
        <strong>My Profile</strong>
      </div>

      <MyAdminProfile />
    </div>
  )
}

export default AdminProfile
