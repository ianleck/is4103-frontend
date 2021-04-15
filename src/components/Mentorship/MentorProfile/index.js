import React from 'react'
import ProfilePrivateCard from 'components/Common/Social/ProfilePrivateCard'
import AboutCard from 'components/Profile/AboutCard'
import IndustryCard from 'components/Profile/IndustryCard'
import OccupationCard from 'components/Profile/OccupationCard'
import PersonalInformationCard from 'components/Profile/PersonalInformationCard'
import PersonalityCard from 'components/Profile/PersonalityCard'
import ProfileBlockedCard from 'components/Common/Social/ProfileBlockedCard'

const MentorProfile = ({ viewUser, isBlocked }) => {
  if (viewUser.isPrivateProfile) return <ProfilePrivateCard />
  if (!isBlocked && !viewUser.isPrivateProfile)
    return (
      <div>
        <PersonalInformationCard user={viewUser} />
        <AboutCard user={viewUser} />
        <IndustryCard user={viewUser} />
        <OccupationCard user={viewUser} />
        <PersonalityCard user={viewUser} />
      </div>
    )
  return <ProfileBlockedCard />
}

export default MentorProfile
