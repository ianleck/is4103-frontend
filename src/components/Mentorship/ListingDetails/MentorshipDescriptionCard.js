import React from 'react'
import { Descriptions } from 'antd'

const MentorshipDescriptionCard = ({ listing }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row justify-content-between">
          <div className="col-12 text-left mt-2">
            <Descriptions title="Mentorship Description">
              <p>{listing.description}</p>
            </Descriptions>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorshipDescriptionCard
