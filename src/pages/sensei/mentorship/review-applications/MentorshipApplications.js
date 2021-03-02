import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import {
  Button,
  ConfigProvider,
  Empty,
  Modal,
  notification,
  Popconfirm,
  Space,
  Table,
  Tabs,
} from 'antd'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { indexOf, filter, isNil, map, size } from 'lodash'
import {
  acceptMentorshipApplication,
  getSenseiMentorshipApplications,
  rejectMentorshipApplication,
} from 'services/mentorshipApplications'

const MentorshipApplications = () => {
  const user = useSelector(state => state.user)
  const [mentorshipApplications, setMentorshipApplications] = useState([])
  const { accountId } = user
  const { TabPane } = Tabs
  const [tabKey, setTabKey] = useState('pending')

  const changeTab = key => {
    setTabKey(key)
  }

  const getApplications = async () => {
    const result = await getSenseiMentorshipApplications(accountId)
    const data = result.contracts.map((c, i) => ({ ...c, key: i }))
    setMentorshipApplications(data)
  }

  const acceptApplication = mentorshipContractId => {
    acceptMentorshipApplication(mentorshipContractId).then(res => {
      if (res) {
        notification.success({ message: res.message })
        getApplications()
      }
    })
  }

  const rejectApplication = mentorshipContractId => {
    rejectMentorshipApplication(mentorshipContractId).then(res => {
      if (res) {
        notification.success({ message: res.message })
        getApplications()
      }
    })
  }

  useEffect(() => {
    getApplications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId])

  const tableColumns = [
    {
      title: 'Mentorship Listing ID',
      dataIndex: 'mentorshipListingId',
      key: 'mentorshipListingId',
    },
    {
      title: 'Mentorship Title',
      dataIndex: 'MentorshipListing',
      key: 'MentorshipListing',
      responsive: ['sm'],
      render: record => <span>{record.name}</span>,
    },
    {
      title: 'Student Name',
      dataIndex: 'Student',
      key: 'studentName',
      responsive: ['md'],
      render: record => {
        return (
          <span>
            {record.firstName} {record.lastName}
          </span>
        )
      },
    },
    {
      title: 'Date Received',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
          {record.senseiApproval === 'PENDING' && (
            <Popconfirm
              title="Are you sure to accept application？"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => acceptApplication(record.mentorshipContractId)}
            >
              <Button type="primary" shape="circle" icon={<CheckOutlined />} />
            </Popconfirm>
          )}
          {record.senseiApproval === 'PENDING' && (
            <Popconfirm
              title="Are you sure to reject application？"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => rejectApplication(record.mentorshipContractId)}
            >
              <Button type="danger" shape="circle" icon={<CloseOutlined />} />
            </Popconfirm>
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
          showApplications(
            'pending',
            filter(mentorshipApplications, ['senseiApproval', 'PENDING']),
            tableColumns,
          )}
        {tabKey === 'approved' &&
          showApplications(
            'approved',
            filter(mentorshipApplications, ['senseiApproval', 'APPROVED']),
            tableColumns,
          )}
        {tabKey === 'rejected' &&
          showApplications(
            'rejected',
            filter(mentorshipApplications, ['senseiApproval', 'REJECTED']),
            tableColumns,
          )}
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
        {record.statement}
      </Modal>
    </div>
  )
}

export default MentorshipApplications
