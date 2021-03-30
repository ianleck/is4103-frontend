import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Popconfirm, Space, Table, Tabs } from 'antd'
import { filter, size } from 'lodash'
import React, { useState } from 'react'
import { CONTRACT_PROGRESS_ENUM } from 'constants/constants'

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
          {record.progress ===
            (CONTRACT_PROGRESS_ENUM.ONGOING || CONTRACT_PROGRESS_ENUM.NOT_STARTED) && (
            <Popconfirm
              title="Are you sure you wish to cancel your subscription?"
              icon={<QuestionCircleOutlined className="text-danger" />}
              onConfirm={() => {}}
            >
              <Button type="danger" shape="circle" size="large" icon={<CloseOutlined />} />
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
      key: 1,
    },
    {
      createdAt: '2020 - 01 - 01',
      name: 'adfadfadf',
      mentorshipContractId: '999999999',
      price: 123.0,
      progress: 'CANCELLED',
      key: 2,
    },
    {
      createdAt: '2020 - 01 - 02',
      name: 'Zdfadfadf',
      mentorshipContractId: '999999999',
      price: 123.0,
      progress: 'CANCELLED',
      key: 3,
    },
    {
      createdAt: '2020 - 01 - 01',
      name: 'adfadfadf',
      mentorshipContractId: '999999999',
      price: 123.0,
      progress: 'COMPLETED',
      key: 4,
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
      if (status === CONTRACT_PROGRESS_ENUM.CANCELLED) {
        textStyle = 'text-danger'
      }
      if (status === (CONTRACT_PROGRESS_ENUM.ONGOING || CONTRACT_PROGRESS_ENUM.COMPLETED)) {
        textStyle = 'text-success'
      }
      return <span className={`${textStyle} font-weight-bold`}>{status.toLowerCase()}</span>
    }
    return (
      <div>
        <div className="row justify-content-between align-items-center mt-2">
          {subscriptionStatus !== CONTRACT_PROGRESS_ENUM.NOT_STARTED && (
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
      <div className="card-header card-header-flex overflow-x-scroll">
        <div className="col-auto mt-4 justify-content-center mr-auto">
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
            CONTRACT_PROGRESS_ENUM.NOT_STARTED,
            filter(mentorshipSubscriptions, ['progress', CONTRACT_PROGRESS_ENUM.NOT_STARTED]),
            tableColumns,
          )}
        {tabKey === 'ongoing' &&
          showSubscriptions(
            CONTRACT_PROGRESS_ENUM.ONGOING,
            filter(mentorshipSubscriptions, ['progress', CONTRACT_PROGRESS_ENUM.ONGOING]),
            tableColumns,
          )}
        {tabKey === 'completed' &&
          showSubscriptions(
            CONTRACT_PROGRESS_ENUM.COMPLETED,
            filter(mentorshipSubscriptions, ['progress', CONTRACT_PROGRESS_ENUM.COMPLETED]),
            tableColumns,
          )}
        {tabKey === 'cancelled' &&
          showSubscriptions(
            CONTRACT_PROGRESS_ENUM.CANCELLED,
            filter(mentorshipSubscriptions, ['progress', CONTRACT_PROGRESS_ENUM.CANCELLED]),
            tableColumns,
          )}
      </div>
    </div>
  )
}

export default MentorshipSubscriptionsTable
