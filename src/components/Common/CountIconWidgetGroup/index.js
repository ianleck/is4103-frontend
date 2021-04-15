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
  noClick,
  pendingPrefix,
  acceptedPrefix,
  rejectedPrefix,
}) => {
  const getClassName = filterName => {
    if (noClick) return null
    if (currentFilter === filterName) return 'btn btn-light'
    return 'btn'
  }

  return (
    <div className="row mt-4">
      <div className="col-12 col-md-4">
        <CountIconWidget
          title={`${pendingPrefix} ${objectType}`}
          className={getClassName('pending')}
          count={numPending}
          icon={<ExceptionOutlined />}
          onClick={handlePendingWidgetOnClick}
          color="orange"
        />
      </div>

      <div className="col-6 col-md-4">
        <CountIconWidget
          title={`${acceptedPrefix} ${objectType}`}
          className={getClassName('accepted')}
          count={numAccepted}
          icon={<CheckOutlined />}
          onClick={handleAcceptedWidgetOnClick}
          color="green"
        />
      </div>

      <div className="col-6 col-md-4">
        <CountIconWidget
          title={`${rejectedPrefix} ${objectType}`}
          className={getClassName('rejected')}
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
