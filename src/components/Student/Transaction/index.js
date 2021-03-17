import { ConfigProvider, Empty, Table } from 'antd'
import { size } from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const StudentTransactionsTable = () => {
  const history = useHistory()

  const user = useSelector(state => state.user)
  const { walletId } = user

  // to get wallet with transactions
  console.log(walletId)

  const emptyData = [
    { key: 1, createdAt: '10 March', billingId: '001', amount: 34.9, productId: '0000110' },
  ]

  const columns = [
    {
      title: 'Date of Transaction',
      dataIndex: 'createdAt',
      key: 'createdAt',
      responsive: ['md'],
      // render: createdAt => formatTime(createdAt),
    },
    {
      title: 'Transaction Id',
      dataIndex: 'billingId',
      key: 'billingId',
      responsive: ['md'],
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
      responsive: ['md'],
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      responsive: ['md'],
      render: amount => amount.toFixed(2),
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
    const isRenderEmpty = numTransactions === 0

    const customizeRenderEmpty = () => (
      <div className="text-center">
        <Empty />
      </div>
    )
    return (
      <div>
        <div className="row justify-content-between align-items-center mt-2">
          <div className="col-auto">
            You currently have {numTransactions}{' '}
            {numTransactions === 1 ? 'transaction' : 'transactions'}.
          </div>
        </div>
        <ConfigProvider renderEmpty={isRenderEmpty && customizeRenderEmpty}>
          <Table
            className="mt-4"
            dataSource={dataSource}
            columns={tableColumns}
            onRow={record => viewTransaction(record)}
          />
        </ConfigProvider>
      </div>
    )
  }
  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5 className="mb-0">Transaction History</h5>
        </div>
      </div>
      <div className="card-body">{showTransactions(emptyData, columns)}</div>
    </div>
  )
}

export default StudentTransactionsTable
