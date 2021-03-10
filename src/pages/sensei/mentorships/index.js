import React from 'react'
import { Helmet } from 'react-helmet'
import MentorshipListingTable from 'components/Sensei/MentorshipListingTable/'

const MentorshipApplications = () => {
  return (
    <div>
      <Helmet title="Mentorship Listings" />
      <MentorshipListingTable />
    </div>
  )
}

export default MentorshipApplications
