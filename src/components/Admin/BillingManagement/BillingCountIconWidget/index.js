import { CarryOutOutlined, SendOutlined, TransactionOutlined } from '@ant-design/icons'
import CountIconWidget from 'components/Common/CountIconWidget'
import { size } from 'lodash'
import React from 'react'

const BillingCountIconWidget = ({ allBillings, allReceived, allSent, objectType, switchTabs }) => {
  return (
    <div className="row mt-4">
      <div className="col-12 col-md-4">
        <CountIconWidget
          title={`Total ${objectType}`}
          className="btn"
          count={size(allBillings)}
          icon={<TransactionOutlined />}
          onClick={() => switchTabs('all')}
        />
      </div>
      <div className="col-12 col-md-4">
        <CountIconWidget
          title={`Total Received ${objectType}`}
          className="btn"
          count={size(allReceived)}
          icon={<CarryOutOutlined />}
          onClick={() => switchTabs('received')}
        />
      </div>
      <div className="col-12 col-md-4">
        <CountIconWidget
          title={`Total Sent ${objectType}`}
          className="btn"
          count={size(allSent)}
          icon={<SendOutlined />}
          onClick={() => switchTabs('sent')}
        />
      </div>
    </div>
  )
}

export default BillingCountIconWidget
