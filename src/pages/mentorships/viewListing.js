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
      <MentorshipProfileHeader />
      <div className="row mt-4">
        <div className="col-12 col-md-2 d-flex align-items-center justify-content-center">
          <MentorshipProfilePicture />
        </div>
        {/* <div className="col-xl-4 col-lg-12">
          <MentorshipDescriptionCard />
        </div>
        <div className="col-xl-4 col-lg-12">
          <MentorshipPricingCard />
        </div> */}
        <div className="col-12 col-md-5 my-2 d-flex align-items-stretch">
          <MentorshipDescriptionCard />
        </div>
        <div className="col-12 col-md-5 my-2 d-flex align-items-stretch">
          <MentorshipPricingCard />
        </div>
        <div className="col-12">
          <MentorshipExperienceCard />
        </div>
      </div>
    </div>
  )
}

export default viewListing
