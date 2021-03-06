import React from 'react'
import { Helmet } from 'react-helmet'
import AdminProfile from '../../../components/Admin/AdminManagement/AdminProfile'

const courseDetails = () => {
  return (
    <div>
      <Helmet title="Course Detail Page" />

      <AdminProfile />
    </div>
  )
}

export default courseDetails
