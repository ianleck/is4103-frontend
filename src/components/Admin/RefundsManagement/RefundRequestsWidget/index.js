import CountIconWidgetGroup from 'components/Common/CountIconWidgetGroup'
import { REFUND_STATUS } from 'constants/constants'
import React, { useEffect, useState } from 'react'

const RefundRequestsWidget = data => {
  const refundRequests = data.data

  const [pending, setPending] = useState(0)
  const [approved, setApproved] = useState(0)
  const [rejected, setRejected] = useState(0)

  useEffect(() => {
    processApplications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refundRequests])

  const processApplications = () => {
    let pendingCounter = 0
    let approvedCounter = 0
    let rejectedCounter = 0

    if (refundRequests.length > 0) {
      for (let i = 0; i < refundRequests.length; i += 1) {
        if (refundRequests[i].approvalStatus === REFUND_STATUS.PENDING) {
          pendingCounter += 1
        } else if (refundRequests[i].approvalStatus === REFUND_STATUS.APPROVED) {
          approvedCounter += 1
        } else if (refundRequests[i].approvalStatus === REFUND_STATUS.REJECTED) {
          rejectedCounter += 1
        }
      }
    }

    setPending(pendingCounter)
    setApproved(approvedCounter)
    setRejected(rejectedCounter)
  }

  return (
    <CountIconWidgetGroup
      objectType="Refund Requests"
      numPending={pending}
      numAccepted={approved}
      numRejected={rejected}
      pendingPrefix="Pending"
      acceptedPrefix="Approved"
      rejectedPrefix="Rejected"
      noClick
    />
  )
}

export default RefundRequestsWidget
