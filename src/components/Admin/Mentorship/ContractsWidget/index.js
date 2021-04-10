import CountIconWidgetGroup from 'components/Common/CountIconWidgetGroup'
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
    let ongoingCounter = 0
    let cancelledCounter = 0
    let completedCounter = 0

    if (contracts.length > 0) {
      for (let i = 0; i < contracts.length; i += 1) {
        if (
          contracts[i].progress === CONTRACT_PROGRESS_ENUM.NOT_STARTED ||
          contracts[i].progress === CONTRACT_PROGRESS_ENUM.ONGOING
        ) {
          ongoingCounter += 1
        } else if (contracts[i].progress === CONTRACT_PROGRESS_ENUM.CANCELLED) {
          cancelledCounter += 1
        } else if (contracts[i].progress === CONTRACT_PROGRESS_ENUM.COMPLETED) {
          completedCounter += 1
        }
      }
    }

    setOngoingCount(ongoingCounter)
    setCancelledCount(cancelledCounter)
    setCompletedCount(completedCounter)
  }

  return (
    <CountIconWidgetGroup
      objectType="Contracts"
      numPending={onGoingCount}
      numAccepted={completedCount}
      numRejected={cancelledCount}
      pendingPrefix="Not Started/Ongoing"
      acceptedPrefix="Completed"
      rejectedPrefix="Cancelled"
      noClick
    />
  )
}

export default ContractsWidget
