import {
  CloseOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Popconfirm, Space, Table, Tabs } from 'antd'
import { filter, size } from 'lodash'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { CONTRACT_PROGRESS_ENUM } from 'constants/constants'
import { getAllStudentMentorshipApplications } from 'services/mentorship/applications'
import { useSelector } from 'react-redux'
import { formatTime } from 'components/utils'

const MentorshipContractsTable = () => {
  const { TabPane } = Tabs
  const history = useHistory()
  const user = useSelector(state => state.user)
  const [tabKey, setTabKey] = useState('ongoing')
  const [mentorshipContracts, setContracts] = useState([])
  const getContracts = async () => {
    const test = await getAllStudentMentorshipApplications(user.accountId)
    if (test) {
      // in order to filter M subscriptions instead of M applications
      const contracts = test.contracts.filter(c => c.senseiApproval === 'APPROVED')
      setContracts(contracts)
    }
  }

  useEffect(() => {
    getContracts()
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
      title: 'Mentorship Contract ID',
      dataIndex: 'mentorshipContractId',
      key: 'mentorshipContractId',
    },
    {
      title: 'Date Applied',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: record => formatTime(record),
      responsive: ['sm'],
    },
    {
      title: 'Mentorship Title',
      dataIndex: ['MentorshipListing', 'name'],
      key: ['MentorshipListing', 'name'],
      responsive: ['md'],
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Mentorship Description',
      dataIndex: ['MentorshipListing', 'description'],
      key: ['MentorshipListing', 'description'],
      responsive: ['md'],
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Pass Price (S$)',
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
            size="large"
            icon={<EyeOutlined />}
            onClick={() => viewListing(record)}
          />
          {(record.progress === CONTRACT_PROGRESS_ENUM.ONGOING ||
            record.progress === CONTRACT_PROGRESS_ENUM.NOT_STARTED) && (
            <Button type="primary" shape="circle" size="large" icon={<ShoppingOutlined />} />
          )}
          {(record.progress === CONTRACT_PROGRESS_ENUM.ONGOING ||
            record.progress === CONTRACT_PROGRESS_ENUM.NOT_STARTED) && (
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

  const showContracts = (subscriptionStatus, dataSource, columns) => {
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
          <h5 className="mb-0">Mentorship Contracts</h5>
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
          showContracts(
            CONTRACT_PROGRESS_ENUM.NOT_STARTED,
            filter(mentorshipContracts, ['progress', CONTRACT_PROGRESS_ENUM.NOT_STARTED]),
            tableColumns,
          )}
        {tabKey === 'ongoing' &&
          showContracts(
            CONTRACT_PROGRESS_ENUM.ONGOING,
            filter(mentorshipContracts, ['progress', CONTRACT_PROGRESS_ENUM.ONGOING]),
            tableColumns,
          )}
        {tabKey === 'completed' &&
          showContracts(
            CONTRACT_PROGRESS_ENUM.COMPLETED,
            filter(mentorshipContracts, ['progress', CONTRACT_PROGRESS_ENUM.COMPLETED]),
            tableColumns,
          )}
        {tabKey === 'cancelled' &&
          showContracts(
            CONTRACT_PROGRESS_ENUM.CANCELLED,
            filter(mentorshipContracts, ['progress', CONTRACT_PROGRESS_ENUM.CANCELLED]),
            tableColumns,
          )}
      </div>
    </div>
  )
}

export default MentorshipContractsTable
