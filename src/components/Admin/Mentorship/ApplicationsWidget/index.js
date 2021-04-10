import CountIconWidgetGroup from 'components/Common/CountIconWidgetGroup'
import { MENTORSHIP_CONTRACT_APPROVAL } from 'constants/constants'
import React, { useEffect, useState } from 'react'

const ApplicationsWidget = data => {
  const applications = data.data

  const [pending, setPending] = useState(0)
  const [approved, setApproved] = useState(0)
  const [rejected, setRejected] = useState(0)

  useEffect(() => {
    processApplications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications])

  const processApplications = () => {
    let pendingCounter = 0
    let approvedCounter = 0
    let rejectedCounter = 0

    if (applications.length > 0) {
      for (let i = 0; i < applications.length; i += 1) {
        if (applications[i].senseiApproval === MENTORSHIP_CONTRACT_APPROVAL.PENDING) {
          pendingCounter += 1
        } else if (applications[i].senseiApproval === MENTORSHIP_CONTRACT_APPROVAL.APPROVED) {
          approvedCounter += 1
        } else if (applications[i].senseiApproval === MENTORSHIP_CONTRACT_APPROVAL.REJECTED) {
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
      objectType="Applications"
      numPending={pending}
      numAccepted={approved}
      numRejected={rejected}
      pendingPrefix="Pending"
      acceptedPrefix="Accepted"
      rejectedPrefix="Rejected"
      noClick
    />
  )
}

export default ApplicationsWidget
