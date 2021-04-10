import { CheckOutlined, CloseOutlined, ExceptionOutlined } from '@ant-design/icons'
import CountIconWidget from 'components/Common/CountIconWidget'
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

  const processApplications = async () => {
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
    <div className="row mt-4">
      <div className="col-12 col-md-4">
        <CountIconWidget
          title="Pending Applications"
          count={pending}
          color="orange"
          icon={<ExceptionOutlined />}
        />
      </div>
      <div className="col-12 col-md-4">
        <CountIconWidget
          title="Approved Applications"
          color="green"
          count={approved}
          icon={<CheckOutlined />}
        />
      </div>
      <div className="col-12 col-md-4">
        <CountIconWidget
          title="Rejected Applications"
          count={rejected}
          color="red"
          icon={<CloseOutlined />}
        />
      </div>
    </div>
  )
}

export default ApplicationsWidget
