import { CheckOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Button, Space, Tag } from 'antd'
import ManagementSkeleton from 'components/Admin/ManagementSkeleton'
import { formatTime, showNotification, sortDescAndKeyBillingId } from 'components/utils'
import { BILLING_STATUS, BILLING_TYPE } from 'constants/constants'
import { BILLING_STATUS_FILTER } from 'constants/filters'
import {
  APPROVE_WITHDRAWAL_REQ,
  APPROVE_WITHDRAWAL_REQ_ERR,
  ERROR,
  SUCCESS,
} from 'constants/notifications'
import { WITHDRAWALS, WITHDRAWAL_MGT } from 'constants/text'
import { filter, isNil, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { approveWithdrawalRequest, rejectWithdrawalRequest, viewBillings } from 'services/wallet'

const WithdrawalManagement = () => {
  const [currentTableData, setCurrentTableData] = useState([])
  const [currentFilter, setCurrentFilter] = useState('all')

  const [allRequests, setAllRequests] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [acceptedRequests, setAcceptedRequests] = useState([])
  const [rejectedRequests, setRejectedRequests] = useState([])

  const handleAcceptedWidgetOnClick = () => {
    setTableData('accepted')
  }
  const handlePendingWidgetOnClick = () => {
    setTableData('pending')
  }
  const handleRejectedWidgetOnClick = () => {
    setTableData('rejected')
  }

  const approveWithdrawal = async billingId => {
    const result = await approveWithdrawalRequest(billingId)
    if (result && result.success) {
      getBillings()
      setCurrentFilter('accepted')
      showNotification('success', SUCCESS, APPROVE_WITHDRAWAL_REQ)
    } else {
      showNotification('error', ERROR, APPROVE_WITHDRAWAL_REQ_ERR)
    }
  }
  const rejectWithdrawal = async billingId => {
    const result = await rejectWithdrawalRequest(billingId)
    if (result && result.success) {
      getBillings()
      setCurrentFilter('rejected')
      showNotification('success', SUCCESS, APPROVE_WITHDRAWAL_REQ)
    } else {
      showNotification('error', ERROR, APPROVE_WITHDRAWAL_REQ_ERR)
    }
  }

  const getBillings = async () => {
    const result = await viewBillings({ filter: { billingType: BILLING_TYPE.WITHDRAWAL } })
    if (result && !isNil(result.billings)) {
      const allWithdrawals = sortDescAndKeyBillingId(result.billings)
      setAllRequests(allWithdrawals)
      setPendingRequests(filter(allWithdrawals, { status: BILLING_STATUS.PENDING_WITHDRAWAL }))
      setAcceptedRequests(filter(allWithdrawals, { status: BILLING_STATUS.WITHDRAWN }))
      setRejectedRequests(filter(allWithdrawals, { status: BILLING_STATUS.REJECTED }))

      switch (currentFilter) {
        case 'all':
          setCurrentTableData(allWithdrawals)
          break
        case 'pending':
          setCurrentTableData(pendingRequests)
          break
        case 'accepted':
          setCurrentTableData(acceptedRequests)
          break
        case 'rejected':
          setCurrentTableData(rejectedRequests)
          break
        default:
          setCurrentTableData(allRequests)
          break
      }
    }
  }

  const setTableData = inputFilter => {
    if (currentFilter === inputFilter) {
      setCurrentTableData(allRequests)
      setCurrentFilter('all')
      return
    }
    switch (inputFilter) {
      case 'pending':
        setCurrentTableData(pendingRequests)
        break
      case 'accepted':
        setCurrentTableData(acceptedRequests)
        break
      case 'rejected':
        setCurrentTableData(rejectedRequests)
        break
      default:
        setCurrentTableData(allRequests)
        break
    }
    setCurrentFilter(inputFilter)
  }

  useEffect(() => {
    getBillings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tableColumns = [
    {
      title: 'Created At',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: '15%',
      responsive: ['lg'],
      render: record => formatTime(record),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Billing Id',
      dataIndex: 'billingId',
      key: 'billingId',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: BILLING_STATUS_FILTER,
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: billingStatus => {
        let color
        if (billingStatus === BILLING_STATUS.WITHDRAWN) {
          color = 'success'
        } else if (billingStatus === BILLING_STATUS.PENDING_WITHDRAWAL) {
          color = 'warning'
        } else {
          color = 'error'
        }
        return <Tag color={color}>{billingStatus}</Tag>
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="large">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              console.log('record is ', record)
            }}
          />
          <Button
            className="btn btn-success"
            size="large"
            shape="circle"
            icon={<CheckOutlined />}
            disabled={record.status !== BILLING_STATUS.PENDING_WITHDRAWAL}
            onClick={() => approveWithdrawal(record.billingId)}
          />
          <Button
            type="danger"
            size="large"
            shape="circle"
            icon={<CloseOutlined />}
            disabled={record.status !== BILLING_STATUS.PENDING_WITHDRAWAL}
            onClick={() => rejectWithdrawal(record.billingId)}
          />
        </Space>
      ),
    },
  ]
  return (
    <ManagementSkeleton
      currentFilter={currentFilter}
      currentTableData={currentTableData}
      handleAcceptedWidgetOnClick={handleAcceptedWidgetOnClick}
      handlePendingWidgetOnClick={handlePendingWidgetOnClick}
      handleRejectedWidgetOnClick={handleRejectedWidgetOnClick}
      numAcceptedRequests={size(acceptedRequests)}
      numPendingRequests={size(pendingRequests)}
      numRejectedRequests={size(rejectedRequests)}
      objectType={WITHDRAWALS}
      pageTitle={WITHDRAWAL_MGT}
      tableColumns={tableColumns}
    />
  )
}

export default WithdrawalManagement
