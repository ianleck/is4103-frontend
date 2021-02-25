import React from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { Alert } from 'antd'
import ProfilePersonalInfoCard from 'components/Profile/PersonalInformationCard'
import ProfileAboutCard from 'components/Profile/AboutCard'

const UpdateProfileNotice = () => {
  return (
    <div className="row mb-3">
      <div className="col-12">
        <Alert
          message="Profile requires update."
          description="Your profile is incomplete. A complete profile is required to perform actions on Digi Dojo."
          type="info"
          showIcon
        />
      </div>
    </div>
  )
}

const StudentProfile = () => {
  const user = useSelector(state => state.user)

  return (
    <div>
      <Helmet title="Profile" />
      {user.requiresProfileUpdate && <UpdateProfileNotice />}
      <div className="row">
        <div className="col-xl-4 col-lg-12">
          <ProfilePersonalInfoCard />
        </div>
        <div className="col-xl-8 col-lg-12">
          <ProfileAboutCard />
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
