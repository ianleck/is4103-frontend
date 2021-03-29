import React from 'react'
import { CheckOutlined, CloseOutlined, ExceptionOutlined } from '@ant-design/icons'
import CountIconWidget from '../CountIconWidget'

const CountIconWidgetGroup = ({
  objectType,
  currentFilter,
  numAccepted,
  numPending,
  numRejected,
  handleAcceptedWidgetOnClick,
  handlePendingWidgetOnClick,
  handleRejectedWidgetOnClick,
}) => {
  return (
    <div className="row mt-4">
      <div className="col-12 col-md-4">
        <CountIconWidget
          title={`Pending ${objectType}`}
          className={`${currentFilter === 'pending' ? 'btn btn-light' : 'btn'}`}
          count={numPending}
          icon={<ExceptionOutlined />}
          onClick={handlePendingWidgetOnClick}
          color="orange"
        />
      </div>

      <div className="col-6 col-md-4">
        <CountIconWidget
          title={`Accepted ${objectType}`}
          className={`${currentFilter === 'accepted' ? 'btn btn-light' : 'btn'}`}
          count={numAccepted}
          icon={<CheckOutlined />}
          onClick={handleAcceptedWidgetOnClick}
          color="green"
        />
      </div>

      <div className="col-6 col-md-4">
        <CountIconWidget
          title={`Rejected ${objectType}`}
          className={`${currentFilter === 'rejected' ? 'btn btn-light' : 'btn'}`}
          count={numRejected}
          icon={<CloseOutlined />}
          onClick={handleRejectedWidgetOnClick}
          color="red"
        />
      </div>
    </div>
  )
}

export default CountIconWidgetGroup
