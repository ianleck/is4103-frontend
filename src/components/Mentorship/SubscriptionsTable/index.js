import { CloseOutlined, EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Popconfirm, Space, Table, Tabs } from 'antd'
import { filter, size } from 'lodash'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { CONTRACT_PROGRESS_ENUM } from 'constants/constants'
import { getAllStudentMentorshipApplications } from 'services/mentorship/applications'
import { useSelector } from 'react-redux'

const MentorshipSubscriptionsTable = () => {
  const { TabPane } = Tabs
  const history = useHistory()
  const user = useSelector(state => state.user)
  const [tabKey, setTabKey] = useState('ongoing')
  const [mentorshipSubscriptions, setSubscriptions] = useState([])
  const getSubscriptions = async () => {
    const test = await getAllStudentMentorshipApplications(user.accountId)
    if (test) {
      // in order to filter M subscriptions instead of M applications
      const contracts = test.contracts.filter(c => c.senseiApproval === 'APPROVED')
      setSubscriptions(contracts)
    }
  }
  useEffect(() => {
    getSubscriptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.accountId])
  const changeTab = key => {
    setTabKey(key)
  }

  const viewListing = listing => {
    history.push({
      pathname: `/student/mentorship/subscription/${listing.mentorshipContractId}`,
    })
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
      dataIndex: 'MentorshipListing',
      key: 'price',
      responsive: ['md'],
      render: record => record.priceAmount.toFixed(2),
      sorter: (a, b) => a.price - b.price,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="large">
          <Button
            type="default"
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => viewListing(record)}
          />
          {record.progress ===
            (CONTRACT_PROGRESS_ENUM.ONGOING || CONTRACT_PROGRESS_ENUM.NOT_STARTED) && (
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
          <Table
            className="mt-4"
            dataSource={dataSource}
            columns={columns}
            rowKey="mentorshipContractId"
          />
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
