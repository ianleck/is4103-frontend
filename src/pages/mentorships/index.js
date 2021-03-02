import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { getMentorshipListings } from 'services/mentorshipListing'
import { Avatar, Card } from 'antd'

const MentorshipListingListPage = () => {
  const [listings, setListings] = useState([])

  const getAllListing = () => {
    getMentorshipListings().then(data => {
      console.log('data =', data)
      console.log(listings)
      if (data) {
        setListings(data.mentorshipListings)
      }
    })
  }
  useEffect(() => {
    getAllListing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <Helmet title="Mentorship Listings" />
      test
      <div className="row">
        {listings &&
          listings.map((l, i) => {
            return renderListing(l, i)
          })}
      </div>
    </div>
  )
}

const renderListing = (listing, i) => {
  console.log('listing =', listing)
  return (
    <Card key={i} className="col-md-3 col-xl-2">
      <div className="col">
        <div className="row">
          <Avatar style={{ backgroundColor: '#C2175B' }}>
            {listing?.Sensei?.firstName.substring(0, 1).toUpperCase()}
          </Avatar>
          <div className="col">
            <div style={{ fontWeight: 'bold' }}>
              {listing?.Sensei?.firstName} {listing?.Sensei?.lastName}
            </div>
            <div>{listing.name}</div>
          </div>
        </div>
        <div className="row">{listing.description}</div>
      </div>
    </Card>
  )
}

export default MentorshipListingListPage
