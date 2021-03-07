import React from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import ProfilePersonalInfoCard from 'components/Profile/PersonalInformationCard'
import ProfileAboutCard from 'components/Profile/AboutCard'
import ProfileOccupationCard from 'components/Profile/OccupationCard'
import ProfileIndustryCard from 'components/Profile/IndustryCard'
import ProfileExperienceCard from 'components/Profile/ExperienceCard'
import ProfilePersonalityCard from 'components/Profile/PersonalityCard'
import ProfileUpdateProfileBanner from 'components/Profile/UpdateProfileBanner'

const StudentProfile = () => {
  const user = useSelector(state => state.user)

  return (
    <div>
      <Helmet title="Profile" />
      {!!user.requiresProfileUpdate && <ProfileUpdateProfileBanner />}
      <div className="row">
        <div className="col-xl-5 col-lg-12">
          <ProfilePersonalInfoCard user={user} showEditTools />
          <ProfileIndustryCard user={user} showEditTools />
          <ProfileOccupationCard user={user} showEditTools />
        </div>
        <div className="col-xl-7 col-lg-12">
          <ProfileAboutCard user={user} showEditTools />
          <ProfileExperienceCard user={user} showEditTools />
          <ProfilePersonalityCard user={user} showEditTools />
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
