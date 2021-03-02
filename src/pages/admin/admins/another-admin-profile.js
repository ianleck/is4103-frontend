import React from 'react'
import { Helmet } from 'react-helmet'
import AdminProfile from '../../../components/Admin/AdminManagement/AdminProfile'

const AnotherAdminProfile = () => {
  return (
    <div>
      <Helmet title="Admin's Profile Page" />

      <AdminProfile />
    </div>
  )
}

export default AnotherAdminProfile
