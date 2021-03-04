import React, { useEffect, useState } from 'react'
import { getMentorshipListings } from 'services/mentorshipListing'
import { Avatar, Card, Tag } from 'antd'
import { useHistory } from 'react-router-dom'
import './index.css'

const MentorshipListingList = () => {
  const [listings, setListings] = useState([])
  const history = useHistory()

  const getAllListing = () => {
    getMentorshipListings().then(data => {
      if (data) {
        setListings(data.mentorshipListings)
      }
    })
  }

  const redirectToListing = id => {
    history.push({
      pathname: `/student/mentorship-listing/${id}`,
    })
  }

  useEffect(() => {
    getAllListing()
  }, [])

  return (
    <div>
      <div
        className="row"
        style={{ fontSize: '18px', color: 'black', marginBottom: '10px', fontWeight: 500 }}
      >
        Featured Mentorships
      </div>
      <div className="row justify-content-start">
        {listings &&
          listings.map(l => {
            return (
              <div
                className="col-xl-3 col-lg-4"
                key={l.mentorshipListingId}
                style={{ paddingLeft: '8px', paddingRight: '8px', paddingBottom: '16px' }}
              >
                {renderListing(l, redirectToListing)}
              </div>
            )
          })}
      </div>
    </div>
  )
}

const renderListing = (listing, redirect) => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16)

  return (
    <Card
      className="clickable hover-shadow"
      style={{ height: '180px', overflowY: 'hidden', position: 'relative' }}
      onClick={() => redirect(listing.mentorshipListingId)}
    >
      <div className="col">
        <div className="row align-items-center">
          <Avatar style={{ backgroundColor: `#${randomColor}` }}>
            {listing?.Sensei?.firstName?.substring(0, 1).toUpperCase()}
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
            return (
              <Tag key={c.categoryId} color="default">
                {c.name}
              </Tag>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

export default MentorshipListingList
