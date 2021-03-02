import React from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import ProfilePersonalInfoCard from 'components/Profile/PersonalInformationCard'
import ProfileAboutCard from 'components/Profile/AboutCard'
import ProfileOccupationCard from 'components/Profile/OccupationCard'
import ProfileIndustryCard from 'components/Profile/IndustryCard'
import ProfileExperienceCard from 'components/Profile/ExperienceCard'
import ProfilePersonalityCard from 'components/Profile/PersonalityCard'
import ProfileVerificationCard from 'components/Profile/ProfileVerificationCard'
import ProfileUpdateProfileBanner from 'components/Profile/UpdateProfileBanner'
import ProfileUploadFilesCard from 'components/Profile/UploadFilesCard'

const SenseiProfile = () => {
  const user = useSelector(state => state.user)

  return (
    <div>
      <Helmet title="Profile" />
      {!!user.requiresProfileUpdate && <ProfileUpdateProfileBanner />}
      <div className="row">
        <div className="col-xl-8 col-lg-12 order-xs-12 order-sm-12 order-md-12 order-lg-1">
          <ProfileAboutCard />
          <ProfileExperienceCard />
          <ProfilePersonalityCard />
          <ProfileUploadFilesCard />
        </div>
        <div className="col-xl-4 col-lg-12 order-xs-1 order-sm-1 order-md-1 order-lg-12">
          <ProfilePersonalInfoCard />
          <ProfileVerificationCard />
          <ProfileIndustryCard />
          <ProfileOccupationCard />
        </div>
      </div>
    </div>
  )
}

export default SenseiProfile
