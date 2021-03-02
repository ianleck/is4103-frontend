import React from 'react'
import { Helmet } from 'react-helmet'
import MentorshipListingList from 'components/Mentorship/MentorshipListingList'

const MentorshipListingListPage = () => {
  return (
    <div>
      <Helmet title="Mentorship Listings" />
      <MentorshipListingList />
    </div>
  )
}

export default MentorshipListingListPage
