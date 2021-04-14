import { Rate } from 'antd'
import { formatTime } from 'components/utils'
import React from 'react'

const MentorshipInfo = ({ listing }) => {
  return (
    <>
      <div className="row p-0 mb-4 align-items-center">
        <div className="col-12 col-lg mt-2">
          <span className="h3 font-weight-bold">{listing.name}</span>
          <br />
          <div className="mt-2">
            <Rate disabled defaultValue={listing.rating} />
          </div>
          <div className="mt-2">
            <small className="text-muted text-uppercase">
              {`Last Updated On ${formatTime(listing.updatedAt)}`}
            </small>
          </div>
        </div>
        <div className="col-12 col-lg-auto">
          <div className="card mb-0 border-0 shadow-none">
            <div className="card-body mt-4 mt-md-0 pt-0 pb-0 pr-3 text-center text-md-right">
              <span className="h3 align-middle">
                {`$${parseFloat(listing.priceAmount).toFixed(2)}`}
              </span>
              <span className="align-middle">/pass</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="mt-4" />
      <div className="mt-4">
        <h3>Mentorship Description</h3>
        <p className="mt-4 pb-4 description-body">{listing.description}</p>
      </div>
    </>
  )
}

export default MentorshipInfo
