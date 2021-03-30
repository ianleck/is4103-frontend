import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import React from 'react'

const BillingCard = props => {
  const { children, isIncoming } = props
  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="row d-flex flex-column justify-content-center mr-auto">
          <div className="col-auto">
            <Tooltip title={isIncoming ? 'Your payments received' : 'Your payments made'}>
              <InfoCircleOutlined className="mx-2" style={{ color: 'black' }} />
            </Tooltip>
            <span className="mb-0 h5 text-dark">
              Billing History ({isIncoming ? 'Received' : 'Sent'})
            </span>
          </div>
        </div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  )
}

export default BillingCard
