import React from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import AdminProfile from '../../../components/Admin/AdminManagement/AdminProfile'

const AnotherAdminProfile = () => {
  const { adminId } = useParams()

  return (
    <div>
      <Helmet title="Admin's Profile Page" />
      <div className="cui__utils__heading">
        <strong>Admin Profile: {adminId}</strong>
      </div>

      <AdminProfile />
    </div>
  )
}

export default AnotherAdminProfile
