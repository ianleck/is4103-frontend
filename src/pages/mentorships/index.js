import React from 'react'
import { Helmet } from 'react-helmet'
import MentorshipListingShoppingList from 'components/Mentorship/ShoppingList'

const BrowseMentorshipListings = () => {
  return (
    <div>
      <Helmet title="Mentorship Listings" />
      <div className="mb-5">
        <img
          src="/resources/images/pages/browse/mentorships.png"
          width="100%"
          alt="mentorship banner"
        />
      </div>
      <MentorshipListingShoppingList />
    </div>
  )
}

export default BrowseMentorshipListings
