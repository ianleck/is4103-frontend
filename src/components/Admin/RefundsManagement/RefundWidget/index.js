import { DollarCircleOutlined } from '@ant-design/icons'
import CountIconWidget from 'components/Common/CountIconWidget'
import { REFUND_STATUS } from 'constants/constants'
import React, { useEffect, useState } from 'react'

const RefundWidget = data => {
  const refundRequests = data.data

  const [amount, setAmount] = useState(0)

  useEffect(() => {
    processRefunds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refundRequests])

  const processRefunds = () => {
    let moneyCounter = 0

    if (refundRequests.length > 0) {
      for (let i = 0; i < refundRequests.length; i += 1) {
        if (refundRequests[i].approvalStatus === REFUND_STATUS.APPROVED) {
          moneyCounter += refundRequests[i].OriginalBillings[0].amount
        }
      }
    }

    setAmount(parseFloat(moneyCounter).toFixed(2))
  }

  return (
    <CountIconWidget title="Total Amount Refunded" count={amount} icon={<DollarCircleOutlined />} />
  )
}

export default RefundWidget
