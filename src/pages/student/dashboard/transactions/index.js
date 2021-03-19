import { Table, Tag } from 'antd'
import TransactionCard from 'components/Student/Transaction'
import { formatTime } from 'components/utils'
import { indexOf, map, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { viewWallet } from 'services/wallet'

const StudentTransactions = () => {
  const history = useHistory()

  const user = useSelector(state => state.user)
  const { walletId } = user
  const [billingsSent, setBillingsSent] = useState([])
  const [billingsReceived, setBillingsReceived] = useState([])

  useEffect(() => {
    const getWalletEffect = async () => {
      const result = await viewWallet(walletId)
      setWalletEffect(result)
    }

    const setWalletEffect = result => {
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
    getWalletEffect()
  }, [walletId])

  const columns = [
    {
      title: 'Date of Transaction',
      dataIndex: 'createdAt',
      key: 'createdAt',
      responsive: ['md'],
      render: createdAt => formatTime(createdAt),
    },
    {
      title: 'Transaction Id',
      dataIndex: 'billingId',
      key: 'billingId',
      responsive: ['md'],
    },
    {
      title: 'Billing Type',
      dataIndex: 'billingType',
      key: 'billingType',
      responsive: ['md'],
      render: record => {
        return <Tag color="geekblue">{record}</Tag>
      },
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
      responsive: ['md'],
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      responsive: ['md'],
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      responsive: ['md'],
      render: amount => parseFloat(amount).toFixed(2),
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
  const showTransactions = (dataSource, tableColumns) => {
    const numTransactions = size(dataSource)

    return (
      <div>
        <div className="row justify-content-between align-items-center mt-2">
          <div className="col-auto">
            You currently have {numTransactions}{' '}
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

  return (
    <div>
      <TransactionCard isIncoming={false}>
        {showTransactions(billingsSent, columns)}
      </TransactionCard>
      <TransactionCard isIncoming>{showTransactions(billingsReceived, columns)}</TransactionCard>
    </div>
  )
}

export default StudentTransactions
