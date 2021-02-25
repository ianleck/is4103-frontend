import React from 'react'
import { Helmet } from 'react-helmet'
import MentorshipApplications from './MentorshipApplications'
import MentorshipListings from './MentorshipListings'

const ReviewApplications = () => {
  return (
    <div>
      <Helmet title="Mentorship | Review Applications" />
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <MentorshipListings />
          <MentorshipApplications />
        </div>
      </div>
    </div>
  )
}

export default ReviewApplications
