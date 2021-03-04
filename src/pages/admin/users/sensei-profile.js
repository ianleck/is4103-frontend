import React from 'react'
import { Helmet } from 'react-helmet'
import SenseiProfileComponent from '../../../components/Admin/UsersManagement/SenseiProfileComponent'

const UserProfile = () => {
  return (
    <div>
      <Helmet title="Sensei's Page" />

      <SenseiProfileComponent />
    </div>
  )
}

export default UserProfile
