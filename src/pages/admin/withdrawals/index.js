import { CheckOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Button, Space, Tag } from 'antd'
import ManagementSkeleton from 'components/Admin/ManagementSkeleton'
import { formatTime } from 'components/utils'
import { BILLING_STATUS } from 'constants/constants'
import { BILLING_STATUS_FILTER } from 'constants/filters'
import { WITHDRAWALS, WITHDRAWAL_MGT } from 'constants/text'
import { size } from 'lodash'
import React from 'react'

const WithdrawalManagement = () => {
  const currentTableData = []
  const currentFilter = 'all'

  const pendingRequests = []
  const acceptedRequests = []
  const rejectedRequests = []

  const handleAcceptedWidgetOnClick = () => {}
  const handlePendingWidgetOnClick = () => {}
  const handleRejectedWidgetOnClick = () => {}

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
            // disabled={record.status !== BILLING_STATUS.PENDING_WITHDRAWAL}
            onClick={() => {}} // for approve withdrawal request
          />
          <Button
            type="danger"
            size="large"
            shape="circle"
            icon={<CloseOutlined />}
            // disabled={record.status !== BILLING_STATUS.PENDING_WITHDRAWAL}
            onClick={() => {}} // for reject withdrawal request
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
