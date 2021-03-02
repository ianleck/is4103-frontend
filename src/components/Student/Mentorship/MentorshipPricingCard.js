import React from 'react'
import { Descriptions } from 'antd'

const MentorshipPricingCard = () => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row justify-content-between">
          <div className="col-12 text-left mt-2">
            <Descriptions title="Pricing ">
              <p>$10/month</p> {/* hard coded to be changed once pricing is added */}
            </Descriptions>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorshipPricingCard
