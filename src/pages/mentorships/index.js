import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { getMentorshipListings } from 'services/mentorshipListing'
import { Avatar, Card, Tag } from 'antd'

const MentorshipListingListPage = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <Helmet title="Mentorship Listings" />
      <div
        className="row"
        style={{ fontSize: '18px', color: 'black', marginBottom: '10px', fontWeight: 500 }}
      >
        Featured Mentorships
      </div>
      <div className="row justify-content-between">
        {listings &&
          listings.map(l => {
            return (
              <div
                className="col-xl-3 col-lg-4"
                key={l.mentorshipListingId}
                style={{ paddingLeft: '8px', paddingRight: '8px', paddingBottom: '16px' }}
              >
                {renderListing(l)}
              </div>
            )
          })}
      </div>
    </div>
  )
}

const renderListing = listing => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16)

  return (
    <Card style={{ height: '180px', overflowY: 'hidden', position: 'relative' }}>
      <div className="col">
        <div className="row align-items-center">
          <Avatar style={{ backgroundColor: `#${randomColor}` }}>
            {listing?.Sensei?.firstName.substring(0, 1).toUpperCase()}
          </Avatar>
          <div className="col">
            <div style={{ fontWeight: 'bold' }}>
              {listing?.Sensei?.firstName} {listing?.Sensei?.lastName}
            </div>
            <div>{listing.name}</div>
          </div>
        </div>
        <div className="row" style={{ height: '65px', overflow: 'hidden', marginBottom: '10px' }}>
          {listing.description}
        </div>
        <div className="row">
          {listing.Categories?.map(c => {
            return <Tag color="default">{c.name}</Tag>
          })}
        </div>
      </div>
    </Card>
  )
}

export default MentorshipListingListPage
