import React, { useEffect, useState } from 'react'
import { getMentorshipListings } from 'services/mentorship/listings'
import { Avatar } from 'antd'
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
            return <ShoppingListCard listing={l} key={l.mentorshipListingId} />
          })}
      </div>
    </div>
  )
}

export default MentorshipListingList
