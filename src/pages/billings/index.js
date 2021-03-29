import { Table } from 'antd'
import SenseiWallet from 'components/Sensei/Wallet'
import BillingCard from 'components/Billing'
import { showNotification, sortDescAndKeyBillingId } from 'components/utils'
import {
  ERROR,
  SUCCESS,
  WITHDRAWAL_REQUEST_ERR,
  WITHDRAWAL_REQUEST_SUCCESS,
} from 'constants/notifications'
import { concat, isNil, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { requestWithdrawal, viewWallet } from 'services/wallet'
import billingColumns from 'components/Common/TableColumns/Billing'
import BillingManagement from 'components/Admin/BillingManagement'
import { USER_TYPE_ENUM } from 'constants/constants'

const Billings = () => {
  const history = useHistory()

  const user = useSelector(state => state.user)
  const [billingsSent, setBillingsSent] = useState([])
  const [billingsReceived, setBillingsReceived] = useState([])
  const [wallet, setWallet] = useState([])

  const { walletId } = user
  const { confirmedAmount, pendingAmount, totalEarned } = wallet

  const isSensei = user.userType === USER_TYPE_ENUM.SENSEI
  const isAdmin = user.userType === USER_TYPE_ENUM.ADMIN
  const isStudent = user.userType === USER_TYPE_ENUM.STUDENT

  const getWallet = async () => {
    const result = await viewWallet(walletId)
    setWallet(result.wallet)

    setBillingsSent(sortDescAndKeyBillingId(result.wallet.BillingsSent))

    setBillingsReceived(sortDescAndKeyBillingId(result.wallet.BillingsReceived))
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
          {!isAdmin && (
            <div className="col-auto">
              You currently have {numBillings} {billingFlow}{' '}
              {numBillings === 1 ? 'billing' : 'billings'}.
            </div>
          )}
        </div>
        <Table
          className={!isAdmin ? 'mt-4' : ''}
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

  // For Sensei and Admin, show Wallet followed by Incoming transactions and finally Outgoing transactions
  // For Student, show Outgoing transactions then Incoming transactions

  const showForSensei = () => {
    return (
      <div>
        <SenseiWallet
          confirmedAmount={confirmedAmount}
          pendingAmount={pendingAmount}
          totalEarned={totalEarned}
          billingsReceived={billingsReceived}
          onWithdraw={handleWithdrawal}
        />
        <BillingCard isIncoming>
          {showBillings('incoming', billingsReceived, billingColumns)}
        </BillingCard>
        <BillingCard isIncoming={false}>
          {showBillings('outgoing', billingsSent, billingColumns)}
        </BillingCard>
      </div>
    )
  }

  const showForStudent = () => {
    return (
      <div>
        <BillingCard isIncoming={false}>
          {showBillings('outgoing', billingsSent, billingColumns)}
        </BillingCard>

        <BillingCard isIncoming>
          {showBillings('incoming', billingsReceived, billingColumns)}
        </BillingCard>
      </div>
    )
  }

  const showForAdmin = () => {
    const allBillings = concat(billingsSent, billingsReceived)
    return (
      <div>
        <BillingManagement
          allReceived={billingsReceived}
          allSent={billingsSent}
          tableColumns={billingColumns}
          allBillings={allBillings}
        />
      </div>
    )
  }

  return (
    <div>
      {isSensei && showForSensei()}
      {isStudent && showForStudent()}
      {isAdmin && showForAdmin()}
    </div>
  )
}

export default Billings
