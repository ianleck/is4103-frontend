import React, { useState, useEffect } from 'react'
import { Button, Descriptions, Modal, Space, Table, Tabs } from 'antd'
import { Helmet } from 'react-helmet'
import { getRefunds } from 'services/wallet'
import { isNil } from 'lodash'
import { formatTime } from 'components/utils'
import StatusTag from 'components/Common/StatusTag'
import { CONTRACT_TYPE_ENUM_FILTER, REFUND_STATUS_ENUM_FILTER } from 'constants/filters'
import { CheckOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { CONTRACT_TYPES, REFUND_STATUS } from 'constants/constants'
import Paragraph from 'antd/lib/typography/Paragraph'
import RefundRequestsWidget from './RefundRequestsWidget'

const { TabPane } = Tabs

const RefundsManagement = () => {
  const [tabKey, setTabKey] = useState('Refund Requests')
  const changeTab = key => {
    setTabKey(key)
  }

  const [refundRequests, setRefundRequests] = useState([])

  const [showRefundRequest, setShowRefundRequest] = useState(false)
  const [refundRequestDetails, setRefundRequestDetails] = useState([])

  useEffect(() => {
    populateRefundRequests()
  }, [])

  const populateRefundRequests = async () => {
    const response = await getRefunds()

    if (response && !isNil(response.refunds)) {
      setRefundRequests(response.refunds)
    }
  }

  console.log('refundRequests', refundRequests)

  const onCloseDetails = () => {
    setShowRefundRequest(false)
  }

  const selectRefundRequest = record => {
    setRefundRequestDetails(record)
    setShowRefundRequest(true)
  }

  const formatName = record => {
    const name = `${record.firstName} ${record.lastName}`
    return name
  }

  const showRefundRequestsWidget = () => {
    return <RefundRequestsWidget data={refundRequests} />
  }

  const showRefundRequests = () => {
    return (
      <Table dataSource={refundRequests} columns={refundRequestColumns} rowKey="refundRequestId" />
    )
  }

  const refundRequestColumns = [
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
      title: 'Refund Request ID',
      key: 'refundRequestId',
      dataIndex: 'refundRequestId',
      width: '15%',
      responsive: ['lg'],
    },
    {
      title: 'Request Owner',
      key: ['RequestOwner'],
      dataIndex: ['RequestOwner'],
      render: record => formatName(record),
    },
    {
      title: 'Contract Type',
      key: 'contractType',
      dataIndex: 'contractType',
      width: '15%',
      responsive: ['sm'],
      render: record => <StatusTag data={record} type="CONTRACT_TYPE" />,
      filters: CONTRACT_TYPE_ENUM_FILTER,
      onFilter: (value, record) => record.contractType.indexOf(value) === 0,
    },
    {
      title: 'Refund Status',
      key: 'approvalStatus',
      dataIndex: 'approvalStatus',
      width: '15%',
      responsive: ['md'],
      render: record => <StatusTag data={record} type="REFUND_STATUS" />,
      filters: REFUND_STATUS_ENUM_FILTER,
      onFilter: (value, record) => record.approvalStatus.indexOf(value) === 0,
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
            onClick={() => selectRefundRequest(record)}
            icon={<InfoCircleOutlined />}
          />
          <Button
            shape="circle"
            size="large"
            className="btn btn-success"
            onClick={() => selectRefundRequest(record)}
            disabled={record.approvalStatus !== REFUND_STATUS.PENDING}
            icon={<CheckOutlined />}
          />
          <Button
            type="danger"
            shape="circle"
            size="large"
            disabled={record.approvalStatus !== REFUND_STATUS.PENDING}
            onClick={() => selectRefundRequest(record)}
            icon={<CloseOutlined />}
          />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="row">
        <Helmet title="Refunds Management" />
        <div className="col-auto">
          <div className="text-dark text-uppercase h3">
            <strong>Refunds Management</strong>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="card">
          <div className="card-header card-header-flex">
            <div className="d-flex flex-column justify-content-center mr-auto">
              <h5>Refunds</h5>
            </div>
            <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
              <TabPane tab="Refund Requests" key="Refund Requests" />
              <TabPane tab="Refunds" key="Refunds" />
            </Tabs>
          </div>

          <div className="card-body">
            {tabKey === 'Refund Requests' && showRefundRequestsWidget()}

            <div className="row">
              <div className="col-12 overflow-x-scroll">
                {tabKey === 'Refund Requests' && showRefundRequests()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-lg-12">
        <Modal
          title="Refund Request Details"
          visible={showRefundRequest}
          cancelText="Close"
          centered
          okButtonProps={{ style: { display: 'none' } }}
          onCancel={() => onCloseDetails()}
        >
          <Descriptions column={1}>
            <Descriptions.Item label="Request ID">
              {refundRequestDetails.refundRequestId}
            </Descriptions.Item>
            <Descriptions.Item label="Request Owner">
              {refundRequestDetails.RequestOwner
                ? formatName(refundRequestDetails.RequestOwner)
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Contract Type">
              {refundRequestDetails.contractType ? (
                <StatusTag data={refundRequestDetails.contractType} type="CONTRACT_TYPE" />
              ) : (
                '-'
              )}
            </Descriptions.Item>

            {refundRequestDetails.contractType === CONTRACT_TYPES.COURSE ? (
              <Descriptions.Item label="Course Title">
                {refundRequestDetails.OriginalBillings
                  ? refundRequestDetails.OriginalBillings[0].Course.title
                  : '-'}
              </Descriptions.Item>
            ) : (
              <Descriptions.Item label="Mentorship Name">
                {refundRequestDetails.OriginalBillings
                  ? refundRequestDetails.OriginalBillings[0].MentorshipListing.name
                  : '-'}
              </Descriptions.Item>
            )}
            {refundRequestDetails.contractType === CONTRACT_TYPES.COURSE ? (
              <Descriptions.Item label="Course Description">
                {refundRequestDetails.OriginalBillings ? (
                  <Paragraph ellipsis={{ rows: 1, expandable: true, symbol: 'More' }}>
                    {refundRequestDetails.OriginalBillings[0].Course.description}
                  </Paragraph>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
            ) : (
              <Descriptions.Item label="Mentorship Description">
                {refundRequestDetails.OriginalBillings ? (
                  <Paragraph ellipsis={{ rows: 1, expandable: true, symbol: 'More' }}>
                    {refundRequestDetails.OriginalBillings[0].MentorshipListing.description}
                  </Paragraph>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Refund Status">
              {refundRequestDetails.approvalStatus ? (
                <StatusTag data={refundRequestDetails.approvalStatus} type="REFUND_STATUS" />
              ) : (
                '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Date Created">
              {refundRequestDetails.createdAt ? formatTime(refundRequestDetails.createdAt) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Date Updated">
              {refundRequestDetails.updatedAt ? formatTime(refundRequestDetails.updatedAt) : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      </div>
    </div>
  )
}

export default RefundsManagement
