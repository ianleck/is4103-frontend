import React from 'react'
import { Helmet } from 'react-helmet'
import MyAdminProfile from '../../../components/Admin/MyAdminProfile/MyAdminProfile'

const AdminProfile = () => {
  return (
    <div>
      <Helmet title="My Profile" />
      <div className="col-auto">
        <div className="text-dark text-uppercase h3">
          <strong>My Profile</strong>
        </div>
      </div>

      <MyAdminProfile />
    </div>
  )
}

export default AdminProfile
