import React, { useState } from 'react'
import { Button, Popconfirm, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

const SenseiWallet = () => {
  const [isConfirmWithdraw, setIsConfirmWithdraw] = useState(false)

  // to get from backend eventually
  const confirmedAmount = 513
  const pendingAmount = 23.4
  const totalAmount = 772.8

  const showPopconfirm = () => {
    setIsConfirmWithdraw(true)
  }

  const handleCancel = () => {
    setIsConfirmWithdraw(false)
  }

  const WalletHeader = () => {
    return (
      <div className="row align-items-center justify-content-between mb-2">
        <div className="col-auto">
          <span className="h3 font-weight-bold text-dark">My Wallet</span>
        </div>
        <div className="col-auto">
          <Tooltip title="Your revenue earned since registeration">
            <InfoCircleOutlined className="mx-2" />
          </Tooltip>
          <span>Total Amount Earned: S${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    )
  }

  const showWithdrawButton = () => {
    return (
      <Popconfirm
        title="Do you wish to withdraw your entire Confirmed Amount? This cannot be reversed."
        visible={isConfirmWithdraw}
        onConfirm={() => {}} // to add when link with backend
        okText="Withdraw"
        okType="primary"
        onCancel={handleCancel}
      >
        <Button block ghost type="primary" onClick={showPopconfirm}>
          Withdraw
        </Button>
      </Popconfirm>
    )
  }

  const ConfirmedAmountContent = () => {
    return (
      <div className="row align-items-center justify-content-between mb-4">
        <div className="col-auto">
          <Tooltip title="For transactions that have passed the 120-day period">
            <InfoCircleOutlined className="mx-2" />
          </Tooltip>
          <span className="text-dark h3">Confirmed Amount</span>
        </div>
        <div className="col-auto">
          <span className="text-dark text-center h3">S${confirmedAmount.toFixed(2)}</span>
        </div>
      </div>
    )
  }

  const PendingAmountFooter = () => {
    return (
      <h6 className="text-muted">
        <Tooltip title="For transactions within the 120-day holding period">
          <InfoCircleOutlined className="mx-2" />
        </Tooltip>
        Pending amount: S${pendingAmount.toFixed(2)}
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
          <div className="col-12">{showWithdrawButton()}</div>
        </div>
      </div>
      <div className="card-footer">
        <PendingAmountFooter />
      </div>
    </div>
  )
}

export default SenseiWallet
