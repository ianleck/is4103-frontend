import React from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { Alert } from 'antd'
import ProfilePersonalInfoCard from 'components/Profile/PersonalInformationCard'
import ProfileAboutCard from 'components/Profile/AboutCard'
import ProfileOccupationCard from 'components/Profile/OccupationCard'
import ProfileIndustryCard from 'components/Profile/IndustryCard'
import ProfileExperienceCard from 'components/Profile/ExperienceCard'
import ProfilePersonalityCard from 'components/Profile/PersonalityCard'
import VerifyProfileCard from 'components/Profile/VerifyProfileCard'

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

const SenseiProfile = () => {
  const user = useSelector(state => state.user)

  return (
    <div>
      <Helmet title="Profile" />
      {!!user.requiresProfileUpdate && <UpdateProfileNotice />}
      <div className="row">
        <div className="col-xl-8 col-lg-12 order-xs-12 order-sm-12 order-md-12 order-lg-1">
          <ProfileAboutCard />
          <ProfileExperienceCard />
          <ProfilePersonalityCard />
        </div>
        <div className="col-xl-4 col-lg-12 order-xs-1 order-sm-1 order-md-1 order-lg-12">
          <ProfilePersonalInfoCard />
          <VerifyProfileCard />
          <ProfileIndustryCard />
          <ProfileOccupationCard />
        </div>
      </div>
    </div>
  )
}

export default SenseiProfile
