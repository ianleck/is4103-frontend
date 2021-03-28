import { Table } from 'antd'
import SenseiWallet from 'components/Sensei/Wallet'
import BillingCard from 'components/Billing'
import { showNotification } from 'components/utils'
import {
  ERROR,
  SUCCESS,
  WITHDRAWAL_REQUEST_ERR,
  WITHDRAWAL_REQUEST_SUCCESS,
} from 'constants/notifications'
import { indexOf, isNil, map, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { requestWithdrawal, viewWallet } from 'services/wallet'
import billingColumns from 'components/Common/TableColumns/Billing'

const Billings = () => {
  const history = useHistory()

  const user = useSelector(state => state.user)
  const [billingsSent, setBillingsSent] = useState([])
  const [billingsReceived, setBillingsReceived] = useState([])
  const [wallet, setWallet] = useState([])

  const { walletId } = user
  const { confirmedAmount, pendingAmount, totalEarned } = wallet

  const isSensei = user.userType === 'SENSEI'

  const getWallet = async () => {
    const result = await viewWallet(walletId)
    setWallet(result.wallet)
    const billingsSnt = map(result.wallet.BillingsSent, billings => ({
      ...billings,
      key: indexOf(result.wallet.BillingsSent, billings),
    }))
    setBillingsSent(billingsSnt)

    const billingsRcv = map(result.wallet.BillingsReceived, billings => ({
      ...billings,
      key: indexOf(result.wallet.BillingsReceived, billings),
    }))
    setBillingsReceived(billingsRcv)
  }
  useEffect(() => {
    if (!isNil(walletId)) {
      getWallet()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const viewBilling = record => {
    return {
      onClick: event => {
        event.preventDefault()
        const path = `billing/view/${record.billingId}`
        history.push(path)
      },
    }
  }
  const showBillings = (billingFlow, dataSource, tableColumns) => {
    const numBillings = size(dataSource)

    return (
      <div>
        <div className="row justify-content-between align-items-center mt-2">
          <div className="col-auto">
            You currently have {numBillings} {billingFlow}{' '}
            {numBillings === 1 ? 'billing' : 'billings'}.
          </div>
        </div>
        <Table
          className="mt-4"
          dataSource={dataSource}
          columns={tableColumns}
          onRow={record => viewBilling(record)}
        />
      </div>
    )
  }

  const handleWithdrawal = async () => {
    const result = await requestWithdrawal(walletId)
    if (result && !isNil(result.success)) {
      if (result.success) {
        showNotification('success', SUCCESS, WITHDRAWAL_REQUEST_SUCCESS)
        getWallet()
      }
    } else {
      showNotification('error', ERROR, WITHDRAWAL_REQUEST_ERR)
    }
  }

  // For Sensei, show Wallet followed by Incoming transactions and finally Outgoing transactiosn
  // For Student, show Outgoing transactions then Incoming transactions
  return (
    <div>
      {isSensei && (
        <SenseiWallet
          confirmedAmount={confirmedAmount}
          pendingAmount={pendingAmount}
          totalEarned={totalEarned}
          billingsReceived={billingsReceived}
          onWithdraw={handleWithdrawal}
        />
      )}
      {isSensei && (
        <BillingCard isIncoming>
          {showBillings('incoming', billingsReceived, billingColumns)}
        </BillingCard>
      )}
      <BillingCard isIncoming={false}>
        {showBillings('outgoing', billingsSent, billingColumns)}
      </BillingCard>
      {!isSensei && (
        <BillingCard isIncoming>
          {showBillings('incoming', billingsReceived, billingColumns)}
        </BillingCard>
      )}
    </div>
  )
}

export default Billings
