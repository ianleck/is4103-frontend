import React from 'react'
import { Helmet } from 'react-helmet'
import SenseiProfileComponent from '../../../components/Admin/UsersManagement/SenseiProfileComponent'

const UserProfile = () => {
  return (
    <div>
      <Helmet title="Sensei Profile" />
      <SenseiProfileComponent />
    </div>
  )
}

export default UserProfile
