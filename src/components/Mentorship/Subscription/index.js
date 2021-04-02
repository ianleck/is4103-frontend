import React from 'react'
import { Helmet } from 'react-helmet'
import MentorshipProfilePicture from 'components/Mentorship/ListingDetails/MentorshipProfilePicture'
import TaskComponent from 'components/Mentorship/Subscription/Task'
import MentorshipDescriptionCard from 'components/Mentorship/ListingDetails/MentorshipDescriptionCard'
import MentorshipProfileHeader from 'components/Mentorship/ListingDetails/MentorshipProfileHeader'
import MentorshipPricingCard from 'components/Mentorship/ListingDetails/MentorshipPricingCard'

const viewSubscription = () => {
  return (
    <div>
      <Helmet title="View Mentorship Subscription" />
      <MentorshipProfileHeader isSubscription />
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
        <div className="col-12">
          <TaskComponent />
        </div>
      </div>
    </div>
  )
}

export default viewSubscription
