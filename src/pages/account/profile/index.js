import React from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import ProfilePersonalInfoCard from 'components/Profile/PersonalInformationCard'
import ProfileAboutCard from 'components/Profile/AboutCard'
import ProfileOccupationCard from 'components/Profile/OccupationCard'
import ProfileIndustryCard from 'components/Profile/IndustryCard'
import ProfileExperienceCard from 'components/Profile/ExperienceCard'
import ProfileInterestsCard from 'components/Profile/InterestsCard'
import ProfilePersonalityCard from 'components/Profile/PersonalityCard'
import ProfileVerificationCard from 'components/Profile/ProfileVerificationCard'
import ProfileUpdateProfileBanner from 'components/Profile/UpdateProfileBanner'
import ProfileUploadFilesCard from 'components/Profile/UploadFilesCard'
import { ADMIN_VERIFIED_ENUM, USER_TYPE_ENUM } from 'constants/constants'

const AccountProfile = () => {
  const user = useSelector(state => state.user)
  const isSensei = user.userType === USER_TYPE_ENUM.SENSEI

  const PageLeft = () => {
    if (isSensei)
      return (
        <>
          <ProfileAboutCard user={user} showEditTools />
          <ProfileExperienceCard user={user} showEditTools />
          <ProfilePersonalityCard user={user} showEditTools />
          <ProfileUploadFilesCard user={user} showUploadButton />
        </>
      )
    return (
      <>
        <ProfilePersonalInfoCard user={user} showEditTools />
        <ProfileIndustryCard user={user} showEditTools />
        <ProfileOccupationCard user={user} showEditTools />
        <ProfileInterestsCard user={user} showEditTools />
      </>
    )
  }

  const PageRight = () => {
    if (isSensei)
      return (
        <>
          <ProfilePersonalInfoCard user={user} showEditTools />
          {user.adminVerified !== ADMIN_VERIFIED_ENUM.ACCEPTED && (
            <ProfileVerificationCard user={user} />
          )}

          <ProfileIndustryCard user={user} showEditTools />
          <ProfileOccupationCard user={user} showEditTools />
        </>
      )
    return (
      <>
        <ProfileAboutCard user={user} showEditTools />
        <ProfileExperienceCard user={user} showEditTools />
        <ProfilePersonalityCard user={user} showEditTools />
      </>
    )
  }

  return (
    <div>
      <Helmet title="Profile" />
      {!!user.requiresProfileUpdate && <ProfileUpdateProfileBanner />}
      <div className="row">
        <div className={isSensei ? 'col-xl-8 col-lg-12 order-12 order-xl-1' : 'col-xl-5 col-lg-12'}>
          <PageLeft />
        </div>
        <div className={isSensei ? 'col-xl-4 col-lg-12 order-1 order-xl-12' : 'col-xl-7 col-lg-12'}>
          <PageRight />
        </div>
      </div>
    </div>
  )
}

export default AccountProfile
