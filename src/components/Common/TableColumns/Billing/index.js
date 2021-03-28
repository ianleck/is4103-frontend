import { Tag } from 'antd'
import { formatTime } from 'components/utils'
import { BILLING_TYPE_FILTER, CURRENCY_FILTERS } from 'constants/filters'
import { isNil } from 'lodash'
import React from 'react'

const billingColumns = [
  {
    title: 'Date of Billing',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '10%',
    responsive: ['sm'],
    render: createdAt => formatTime(createdAt),
    sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Billing Id',
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
    filters: CURRENCY_FILTERS,
    onFilter: (value, record) => record.currency.indexOf(value) === 0,
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

export default billingColumns
