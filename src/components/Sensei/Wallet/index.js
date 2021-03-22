import React, { useEffect, useState } from 'react'
import { Button, Popconfirm, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
// import { useSelector } from 'react-redux'
import { filter, isEmpty, isNil } from 'lodash'

const SenseiWallet = ({
  totalEarned,
  pendingAmount,
  confirmedAmount,
  billingsReceived,
  onWithdraw,
}) => {
  const [isConfirmWithdraw, setIsConfirmWithdraw] = useState(false)
  const [isExistingWithdrawalRequest, setIsExistingWithdrawalRequest] = useState(false)

  const isWithdrawable = confirmedAmount > 0
  useEffect(() => {
    const result = !isEmpty(filter(billingsReceived, ['status', 'PENDING_WITHDRAWAL']))
    setIsExistingWithdrawalRequest(result)
  }, [billingsReceived])

  const showPopconfirm = () => {
    setIsConfirmWithdraw(true)
  }

  const handleCancel = () => {
    setIsConfirmWithdraw(false)
  }

  const handleWithdrawConfirmedAmount = async () => {
    setIsConfirmWithdraw(false)
    onWithdraw()
  }

  const WalletHeader = () => {
    return (
      <div className="row align-items-center justify-content-between mb-2">
        <div className="col-auto">
          <span className="h3 font-weight-bold text-dark">My Wallet</span>
        </div>
        <div className="col-auto">
          <Tooltip title="Your revenue earned since registration">
            <InfoCircleOutlined className="mx-2" />
          </Tooltip>
          <span>
            Total Amount Earned: S${!isNil(totalEarned) ? parseFloat(totalEarned).toFixed(2) : '-'}
          </span>
        </div>
      </div>
    )
  }

  const WithdrawButton = () => {
    return (
      <Popconfirm
        title="Do you wish to withdraw your entire Confirmed Amount? This cannot be reversed."
        visible={isConfirmWithdraw}
        onConfirm={() => handleWithdrawConfirmedAmount()}
        okText="Withdraw"
        okType="primary"
        onCancel={handleCancel}
      >
        <Button
          block
          ghost
          disabled={!isWithdrawable || isExistingWithdrawalRequest}
          type="primary"
          onClick={showPopconfirm}
        >
          Withdraw
        </Button>
      </Popconfirm>
    )
  }

  const ConfirmedAmountContent = () => {
    const textStyle = isExistingWithdrawalRequest ? 'text-muted' : 'text-dark'
    return (
      <div className="row align-items-center justify-content-between mb-4">
        <div className="col-auto">
          <Tooltip title="For billings that have passed the 120-day period">
            <InfoCircleOutlined className="mx-2" />
          </Tooltip>
          <span className="text-dark h3">Confirmed Amount</span>
        </div>
        <div className="col-auto">
          <span className={`${textStyle} text-center h3`}>
            S${!isNil(confirmedAmount) ? parseFloat(confirmedAmount).toFixed(2) : '-'}
          </span>
        </div>
      </div>
    )
  }

  const PendingAmountFooter = () => {
    return (
      <h6 className="text-muted">
        <Tooltip title="For billings within the 120-day holding period">
          <InfoCircleOutlined className="mx-2" />
        </Tooltip>
        Pending amount: S${!isNil(pendingAmount) ? parseFloat(pendingAmount).toFixed(2) : '-'}
      </h6>
    )
  }

  return (
    <div className="card">
      <div className="card-header pb-1">
        <WalletHeader />
      </div>
      <div className="card-body">
        <ConfirmedAmountContent />
        <div className="row d-flex">
          <div className="col-12">
            <WithdrawButton />
          </div>
          {!isWithdrawable && (
            <div className="col-12 mt-2">
              <small className="text-muted">
                Confirmed amount has to be more than $0 to withdraw.
              </small>
            </div>
          )}
          {isExistingWithdrawalRequest && (
            <div className="col-12 mt-2">
              <small className="text-muted">There is currently a pending withdrawal request.</small>
            </div>
          )}
        </div>
      </div>
      <div className="card-footer">
        <PendingAmountFooter />
      </div>
    </div>
  )
}

export default SenseiWallet
