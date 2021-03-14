import React from 'react'
import { Helmet } from 'react-helmet'
import MentorshipListingShoppingList from 'components/Mentorship/ShoppingList'

const BrowseMentorshipListings = () => {
  return (
    <div>
      <Helmet title="Mentorship Listings" />
      <MentorshipListingShoppingList />
    </div>
  )
}

export default BrowseMentorshipListings
