import React, { useEffect, useState } from 'react'
import { getMentorshipListings } from 'services/mentorship/listings'
import ShoppingListCard from 'components/Mentorship/ShoppingListCard'

const MentorshipListingList = () => {
  const [listings, setListings] = useState([])

  const getAllListing = () => {
    getMentorshipListings().then(data => {
      if (data) {
        setListings(data.mentorshipListings)
      }
    })
  }

  useEffect(() => {
    getAllListing()
  }, [])

  return (
    <div>
      <div className="row">
        {listings &&
          listings.map(l => {
            return <ShoppingListCard listing={l} key={l.mentorshipListingId} />
          })}
      </div>
    </div>
  )
}

export default MentorshipListingList
