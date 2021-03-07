import React, { useEffect, useState } from 'react'
import { getMentorshipListings } from 'services/mentorshipListing'
import { Avatar, Space, Tag } from 'antd'
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
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="font-weight-bold">Featured Mentorships</h4>
              <div className="row mt-4">
                <div className="col-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-auto">
                          <Avatar size={128} />
                        </div>
                        <div className="col">
                          <h3 className="card-title text-wrap">Listing Name</h3>
                          <h4 className="card-subtitle mb-2 text-muted text-wrap">Mentor Name</h4>
                          <p className="text-dark mt-4">Listing Description</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-auto">
                          <Avatar size={128} />
                        </div>
                        <div className="col">
                          <h3 className="card-title text-wrap">Listing Name</h3>
                          <h4 className="card-subtitle mb-2 text-muted text-wrap">Mentor Name</h4>
                          <p className="text-dark mt-4">Listing Description</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {listings &&
          listings.map(l => {
            return (
              <div
                className="col-12 col-md-6 col-lg-4 my-2 d-flex align-items-stretch"
                key={l.mentorshipListingId}
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
    <div
      role="button"
      tabIndex={0}
      key={listing.mentorshipListingId}
      className="card btn btn-block d-flex align-items-center justify-content-center"
      onClick={() => redirect(listing.mentorshipListingId)}
      onKeyDown={event => event.preventDefault()}
    >
      <div className="card-body container p-3">
        <div className="row align-items-center">
          <div className="col-auto text-left">
            <Avatar size={32} style={{ backgroundColor: `#${randomColor}` }}>
              {listing?.Sensei?.firstName?.substring(0, 1).toUpperCase()}
            </Avatar>
          </div>
          <span className="text-dark font-weight-bold text-wrap text-left">
            {listing?.Sensei?.firstName} {listing?.Sensei?.lastName}
          </span>
        </div>
        <div className="row mt-4">
          <div className="col-12 text-left">
            <span className="w-100 d-inline-block">{listing.name}</span>
          </div>
          <div className="col-12 text-left mt-0">
            <small className="w-100 d-inline-block text-dark text-truncate">
              {listing.description}
            </small>
          </div>
        </div>
        <div className="row text-left mt-2">
          <div className="col-12">
            {listing.Categories?.map(c => {
              return (
                <Space key={c.categoryId}>
                  <Tag className="mb-2" color="default">
                    {c.name}
                  </Tag>
                </Space>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorshipListingList
