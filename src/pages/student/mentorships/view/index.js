import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import MentorshipProfilePicture from 'components/Mentorship/ListingDetails/MentorshipProfilePicture'
import MentorshipExperienceCard from 'components/Mentorship/ListingDetails/MentorshipExperienceCard'
import MentorshipDescriptionCard from 'components/Mentorship/ListingDetails/MentorshipDescriptionCard'
import MentorshipProfileHeader from 'components/Mentorship/ListingDetails/MentorshipProfileHeader'
import MentorshipPricingCard from 'components/Mentorship/ListingDetails/MentorshipPricingCard'
import { getMentorshipListing } from 'services/mentorship/listings'
import { isNil } from 'lodash'

const ViewListing = () => {
  const { id } = useParams()
  const [listing, setListing] = useState('')

  const getListing = async () => {
    const response = await getMentorshipListing(id)
    console.log(response)
    if (response && !isNil(response.mentorshipListing)) setListing(response.mentorshipListing)
  }

  useEffect(() => {
    getListing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Helmet title="View Mentorship Listing" />
      <MentorshipProfileHeader />
      <div className="row mt-4">
        <div className="col-12 col-md-2 d-flex align-items-center justify-content-center">
          <MentorshipProfilePicture listing={listing} />
        </div>
        {/* DON'T COPY STUFF FROM THIS COMPONENT */}
        <div className="col-12 col-md-5 my-2 d-flex align-items-stretch">
          <MentorshipDescriptionCard listing={listing} />
        </div>
        <div className="col-12 col-md-5 my-2 d-flex align-items-stretch">
          <MentorshipPricingCard />
        </div>
        {/* DON'T COPY STUFF FROM THIS COMPONENT */}
        <div className="col-12">
          <MentorshipExperienceCard />
        </div>
      </div>
    </div>
  )
}

export default ViewListing
