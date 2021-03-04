import React from 'react'
import { Descriptions } from 'antd'

const MentorshipPricingCard = () => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="col-12 text-left mt-2">
          <Descriptions title="Pricing ">
            <div>$10/month {/* hard coded to be changed once pricing is added */}</div>
          </Descriptions>
        </div>
      </div>
    </div>
  )
}

export default MentorshipPricingCard
