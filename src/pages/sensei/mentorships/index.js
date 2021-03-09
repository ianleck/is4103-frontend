import React from 'react'
import { Helmet } from 'react-helmet'
import MentorshipListings from './MentorshipListings'

const MentorshipApplications = () => {
  return (
    <div>
      <Helmet title="Mentorship | Review Applications" />
      <div className="row">
        <div className="col-12">
          <MentorshipListings />
        </div>
      </div>
    </div>
  )
}

export default MentorshipApplications
