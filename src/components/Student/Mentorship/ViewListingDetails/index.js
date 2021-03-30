import React from 'react'
import { Helmet } from 'react-helmet'
import MentorshipProfilePicture from 'components/Mentorship/ListingDetails/MentorshipProfilePicture'
import MentorshipExperienceCard from 'components/Mentorship/ListingDetails/MentorshipExperienceCard'
import MentorshipDescriptionCard from 'components/Mentorship/ListingDetails/MentorshipDescriptionCard'
import MentorshipProfileHeader from 'components/Mentorship/ListingDetails/MentorshipProfileHeader'
import MentorshipPricingCard from 'components/Mentorship/ListingDetails/MentorshipPricingCard'

const ViewListing = () => {
  return (
    <div>
      <Helmet title="View Mentorship Listing" />
      <MentorshipProfileHeader />
      <div className="row mt-4">
        <div className="col-12 col-md-2 d-flex align-items-center justify-content-center">
          <MentorshipProfilePicture />
        </div>
        {/* DON'T COPY STUFF FROM THIS COMPONENT */}
        <div className="col-12 col-md-5 my-2 d-flex align-items-stretch">
          <MentorshipDescriptionCard />
        </div>
        <div className="col-12 col-md-5 my-2 d-flex align-items-stretch">
          <MentorshipPricingCard />
        </div>
        {/* DON'T COPY STUFF FROM THIS COMPONENT */}
        <div className="col-12">
          <MentorshipExperienceCard />
        </div>
      </div>
    </div>
  )
}

export default ViewListing
