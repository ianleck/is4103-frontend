import { Table, Tag } from 'antd'
import SenseiWallet from 'components/Sensei/Wallet'
import TransactionCard from 'components/Student/Transaction'
import { formatTime, showNotification } from 'components/utils'
import { BILLING_TYPE_FILTER } from 'constants/filters'
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

const StudentTransactions = () => {
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

  const columns = [
    {
      title: 'Date of Transaction',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '10%',
      responsive: ['sm'],
      render: createdAt => formatTime(createdAt),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Transaction Id',
      dataIndex: 'billingId',
      key: 'billingId',
      width: '10%',
      responsive: ['sm'],
    },
    {
      title: 'Billing Type',
      dataIndex: 'billingType',
      key: 'billingType',
      width: '10%',
      responsive: ['md'],
      render: record => {
        return <Tag color="geekblue">{record}</Tag>
      },
      filters: BILLING_TYPE_FILTER,
      onFilter: (value, record) => record.billingType.indexOf(value) === 0,
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
      width: '10%',
      responsive: ['lg'],
      render: record => {
        return isNil(record) ? '-' : record
      },
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      width: '10%',
      responsive: ['md'],
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '10%',
      responsive: ['md'],
      render: amount => parseFloat(amount).toFixed(2),
      sorter: (a, b) => a.amount - b.amount,
      sortDirections: ['ascend', 'descend'],
    },
  ]

  const viewTransaction = record => {
    return {
      onClick: event => {
        event.preventDefault()
        const path = `transaction/view/${record.billingId}`
        history.push(path)
      },
    }
  }
  const showTransactions = (transactionFlow, dataSource, tableColumns) => {
    const numTransactions = size(dataSource)

    return (
      <div>
        <div className="row justify-content-between align-items-center mt-2">
          <div className="col-auto">
            You currently have {numTransactions} {transactionFlow}{' '}
            {numTransactions === 1 ? 'transaction' : 'transactions'}.
          </div>
        </div>
        <Table
          className="mt-4"
          dataSource={dataSource}
          columns={tableColumns}
          onRow={record => viewTransaction(record)}
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
        <TransactionCard isIncoming>
          {showTransactions('incoming', billingsReceived, columns)}
        </TransactionCard>
      )}
      <TransactionCard isIncoming={false}>
        {showTransactions('incoming', billingsSent, columns)}
      </TransactionCard>
      {!isSensei && (
        <TransactionCard isIncoming>
          {showTransactions('outgoing', billingsReceived, columns)}
        </TransactionCard>
      )}
    </div>
  )
}

export default StudentTransactions
