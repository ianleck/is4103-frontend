import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Modal, Space, Table, Tabs } from 'antd'
import { filter, size } from 'lodash'
import React, { useState } from 'react'

const MentorshipApplications = () => {
  const { TabPane } = Tabs
  const [tabKey, setTabKey] = useState('pending')

  const changeTab = key => {
    setTabKey(key)
  }
  // for table
  // TO DO: get from state eventually
  const data = [
    {
      key: '1',
      mentorshipListingId: 'MENT001',
      category: 'Finance',
      studentName: 'Ann',
      dateReceived: '02-01-2021',
      status: 'pending',
      personalStatement:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      key: '2',
      mentorshipListingId: 'MENT002',
      category: 'Digital Illustration',
      studentName: 'Bob',
      dateReceived: '03-02-2021',
      status: 'approved',
      personalStatement:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      key: '3',
      mentorshipListingId: 'MENT002',
      category: 'Digital Illustration',
      studentName: 'Charlie',
      dateReceived: '03-02-2021',
      status: 'rejected',
      personalStatement:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
  ]

  // const emptyData = []

  const tableColumns = [
    {
      title: 'Mentorship Listing ID',
      dataIndex: 'mentorshipListingId',
      key: 'mentorshipListingId',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      responsive: ['sm'],
    },
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
      responsive: ['md'],
    },
    {
      title: 'Date Received',
      dataIndex: 'dateReceived',
      key: 'dateReceived',
      responsive: ['md'],
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="large">
          <div>
            <ViewPersonalStatementButton record={record} />
          </div>
          {record.status === 'pending' && (
            <Button type="primary" shape="circle" icon={<CheckOutlined />} />
          )}
          {record.status === 'pending' && (
            <Button type="danger" shape="circle" icon={<CloseOutlined />} />
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5 className="mb-0">Mentorship Applications</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Pending" key="pending" />
          <TabPane tab="Approved" key="approved" />
          <TabPane tab="Rejected" key="rejected" />
        </Tabs>
      </div>
      <div className="card-body">
        {tabKey === 'pending' &&
          showApplications('pending', filter(data, ['status', 'pending']), tableColumns)}
        {tabKey === 'approved' &&
          showApplications('approved', filter(data, ['status', 'approved']), tableColumns)}
        {tabKey === 'rejected' &&
          showApplications('rejected', filter(data, ['status', 'rejected']), tableColumns)}
      </div>
    </div>
  )
}

const showApplications = (applicationStatus, dataSource, columns) => {
  const numApplications = size(dataSource)
  const isRenderEmpty = numApplications === 0

  const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center' }}>
      <Empty />
    </div>
  )
  const renderStyledStatus = status => {
    let textStyle = ''
    if (status === 'rejected') {
      textStyle = 'text-danger'
    }
    if (status === 'approved') {
      textStyle = 'text-success'
    }
    return <span className={`${textStyle} font-weight-bold`}>{status}</span>
  }
  return (
    <div>
      <div className="row justify-content-between align-items-center mb-3">
        <div className="col-auto">
          <div>
            You currently have {numApplications} {renderStyledStatus(applicationStatus)} mentorship{' '}
            {numApplications === 1 ? 'application' : 'applications'}.
          </div>
        </div>
      </div>
      <ConfigProvider renderEmpty={isRenderEmpty && customizeRenderEmpty}>
        <Table dataSource={dataSource} columns={columns} />
      </ConfigProvider>
    </div>
  )
}

const ViewPersonalStatementButton = values => {
  const { record } = values
  const [isViewStatementModalVisible, setIsViewStatementModalVisible] = useState(false)

  const showModal = () => {
    setIsViewStatementModalVisible(true)
  }

  const handleOk = () => {
    setIsViewStatementModalVisible(false)
  }

  const handleCancel = () => {
    setIsViewStatementModalVisible(false)
  }
  return (
    <div>
      <Button type="default" shape="circle" icon={<EyeOutlined />} onClick={showModal} />
      <Modal
        title="View Personal Statement"
        visible={isViewStatementModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="OK" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        {record.personalStatement}
      </Modal>
    </div>
  )
}

export default MentorshipApplications
