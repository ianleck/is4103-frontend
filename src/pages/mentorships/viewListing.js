import React from 'react'
import { Helmet } from 'react-helmet'
import MentorshipProfilePicture from 'components/Student/Mentorship/MentorshipProfilePicture'
import MentorshipExperienceCard from 'components/Student/Mentorship/MentorshipExperienceCard'
import MentorshipDescriptionCard from 'components/Student/Mentorship/MentorshipDescriptionCard'
import MentorshipProfileHeader from 'components/Student/Mentorship/MentorshipProfileHeader'
import MentorshipPricingCard from 'components/Student/Mentorship/MentorshipPricingCard'

const viewListing = () => {
  return (
    <div>
      <Helmet title="MentorshipListing" />
      <div className="row">
        <div className="col-xl-12 ">
          <MentorshipProfileHeader />
        </div>
      </div>
      <div className="row">
        <div
          className="col-xl-2 "
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <MentorshipProfilePicture />
        </div>
        <div className="col-xl-4 col-lg-12">
          <MentorshipDescriptionCard />
        </div>
        <div className="col-xl-4 col-lg-12">
          <MentorshipPricingCard />
        </div>
        <div className="col-xl-12 col-lg-12">
          <MentorshipExperienceCard />
        </div>
      </div>
    </div>
  )
}

export default viewListing
