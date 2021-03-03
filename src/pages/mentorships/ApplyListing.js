import React from 'react'
import { Helmet } from 'react-helmet'
import ApplyListingForm from 'components/Mentorship/MentorshipApplications/Form'

const ApplyListing = () => {
  return (
    <div>
      <Helmet title="Mentorship Listings" />
      <ApplyListingForm />
    </div>
  )
}

export default ApplyListing
