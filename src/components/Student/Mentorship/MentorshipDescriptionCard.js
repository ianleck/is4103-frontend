import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd'
import { useParams } from 'react-router-dom'
import { getMentorshipListing } from 'services/mentorshipListing'

const MentorshipDescriptionCard = () => {
  const [listingDescription, setListingDescription] = useState([])
  const { mentorshipListingId } = useParams()

  useEffect(() => {
    const getListing = async () => {
      const listing = await getMentorshipListing(mentorshipListingId)
      if (!listing) {
        setListingDescription('Blank Description')
      } else {
        setListingDescription(listing.mentorshipListing.description)
      }
    }
    getListing()
  }, [mentorshipListingId])

  return (
    <div className="card">
      <div className="card-body">
        <div className="row justify-content-between">
          <div className="col-12 text-left mt-2">
            <Descriptions title="Mentorship Description">
              <p>{listingDescription}</p>
            </Descriptions>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorshipDescriptionCard
