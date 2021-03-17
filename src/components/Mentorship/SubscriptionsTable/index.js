import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Popconfirm, Space, Table, Tabs } from 'antd'
import { filter, size } from 'lodash'
import React, { useState } from 'react'

const MentorshipSubscriptionsTable = () => {
  const { TabPane } = Tabs
  const [tabKey, setTabKey] = useState('ongoing')
  const changeTab = key => {
    setTabKey(key)
  }

  const tableColumns = [
    {
      title: 'Mentorship Subscription ID',
      dataIndex: 'mentorshipContractId',
      key: 'mentorshipContractId',
    },
    {
      title: 'Date Applied',
      dataIndex: 'createdAt',
      key: 'createdAt',
      responsive: ['sm'],
    },
    {
      title: 'Mentorship Title',
      dataIndex: 'name',
      key: 'name',
      responsive: ['md'],
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Monthly Subscription Price (S$)',
      dataIndex: 'price',
      key: 'price',
      responsive: ['md'],
      render: record => record.toFixed(2),
      sorter: (a, b) => a.price - b.price,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="large">
          {record.progress === 'ONGOING' && (
            <Popconfirm
              title="Are you sure you wish to cancel your subscription?"
              icon={<QuestionCircleOutlined className="text-danger" />}
              onConfirm={() => {}}
            >
              <Button type="danger" shape="circle" icon={<CloseOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  const mentorshipSubscriptions = [
    {
      createdAt: '2020-01-01',
      name: 'adfadfadf',
      mentorshipContractId: '999999999',
      price: 123.0,
      progress: 'ONGOING',
    },
    {
      createdAt: '2020 - 01 - 01',
      name: 'adfadfadf',
      mentorshipContractId: '999999999',
      price: 123.0,
      progress: 'CANCELLED',
    },
    {
      createdAt: '2020 - 01 - 02',
      name: 'Zdfadfadf',
      mentorshipContractId: '999999999',
      price: 123.0,
      progress: 'CANCELLED',
    },
    {
      createdAt: '2020 - 01 - 01',
      name: 'adfadfadf',
      mentorshipContractId: '999999999',
      price: 123.0,
      progress: 'COMPLETED',
    },
  ]

  const showSubscriptions = (subscriptionStatus, dataSource, columns) => {
    const numSubscriptions = size(dataSource)
    const isRenderEmpty = numSubscriptions === 0

    const customizeRenderEmpty = () => (
      <div className="text-center">
        <Empty />
      </div>
    )
    const renderStyledStatus = status => {
      let textStyle = ''
      if (status === 'cancelled') {
        textStyle = 'text-danger'
      }
      if (status === 'ongoing' || status === 'completed') {
        textStyle = 'text-success'
      }
      return <span className={`${textStyle} font-weight-bold`}>{status}</span>
    }
    return (
      <div>
        <div className="row justify-content-between align-items-center mt-2">
          {subscriptionStatus !== 'notStarted' && (
            <div className="col-auto">
              You currently have {numSubscriptions} {renderStyledStatus(subscriptionStatus)}{' '}
              mentorship {numSubscriptions === 1 ? 'subscription' : 'subscriptions'}.
            </div>
          )}
        </div>
        <ConfigProvider renderEmpty={isRenderEmpty && customizeRenderEmpty}>
          <Table className="mt-4" dataSource={dataSource} columns={columns} />
        </ConfigProvider>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5 className="mb-0">Mentorship Subscriptions</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Not Started" key="notStarted" />
          <TabPane tab="Ongoing" key="ongoing" />
          <TabPane tab="Completed" key="completed" />
          <TabPane tab="Cancelled" key="cancelled" />
        </Tabs>
      </div>
      <div className="card-body">
        {' '}
        {tabKey === 'notStarted' &&
          showSubscriptions(
            'notStarted',
            filter(mentorshipSubscriptions, ['progress', 'NOT_STARTED']),
            tableColumns,
          )}
        {tabKey === 'ongoing' &&
          showSubscriptions(
            'ongoing',
            filter(mentorshipSubscriptions, ['progress', 'ONGOING']),
            tableColumns,
          )}
        {tabKey === 'completed' &&
          showSubscriptions(
            'completed',
            filter(mentorshipSubscriptions, ['progress', 'CANCELLED']),
            tableColumns,
          )}
        {tabKey === 'cancelled' &&
          showSubscriptions(
            'cancelled',
            filter(mentorshipSubscriptions, ['progress', 'COMPLETED']),
            tableColumns,
          )}
      </div>
    </div>
  )
}

export default MentorshipSubscriptionsTable
