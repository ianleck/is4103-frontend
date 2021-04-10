import { CheckOutlined, CloseOutlined, ExceptionOutlined } from '@ant-design/icons'
import CountIconWidget from 'components/Common/CountIconWidget'
import { CONTRACT_PROGRESS_ENUM } from 'constants/constants'
import React, { useEffect, useState } from 'react'

const ContractsWidget = data => {
  const contracts = data.data

  const [onGoingCount, setOngoingCount] = useState(0)
  const [cancelledCount, setCancelledCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    processContracts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const processContracts = () => {
    let onGoingcounter = 0
    let cancelledcounter = 0
    let completedcounter = 0

    if (contracts.length > 0) {
      for (let i = 0; i < contracts.length; i += 1) {
        if (
          contracts[i].progress === CONTRACT_PROGRESS_ENUM.NOT_STARTED ||
          contracts[i].progress === CONTRACT_PROGRESS_ENUM.ONGOING
        ) {
          onGoingcounter += 1
        } else if (contracts[i].progress === CONTRACT_PROGRESS_ENUM.CANCELLED) {
          cancelledcounter += 1
        } else if (contracts[i].progress === CONTRACT_PROGRESS_ENUM.COMPLETED) {
          completedcounter += 1
        }
      }
    }

    setOngoingCount(onGoingcounter)
    setCancelledCount(cancelledcounter)
    setCompletedCount(completedcounter)
  }

  return (
    <div className="row mt-4">
      <div className="col-12 col-md-4">
        <CountIconWidget
          title="Not started/ Ongoing Mentorships"
          count={onGoingCount}
          color="orange"
          icon={<ExceptionOutlined />}
        />
      </div>
      <div className="col-12 col-md-4">
        <CountIconWidget
          title="Completed Mentorships"
          count={completedCount}
          color="green"
          icon={<CheckOutlined />}
        />
      </div>
      <div className="col-12 col-md-4">
        <CountIconWidget
          title="Cancelled Mentorships"
          color="red"
          count={cancelledCount}
          icon={<CloseOutlined />}
        />
      </div>
    </div>
  )
}

export default ContractsWidget
