import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
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
  Tag,
} from 'antd'
import { filter, map, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  acceptMentorshipApplication,
  cancelMentorshipApplication,
  getAllStudentMentorshipApplications,
  getSenseiMentorshipApplications,
  rejectMentorshipApplication,
} from 'services/mentorship/applications'
import { MENTORSHIP_CONTRACT_APPROVAL } from 'constants/constants'
import { formatTime } from 'components/utils'

const MentorshipApplicationsTable = () => {
  const user = useSelector(state => state.user)
  const history = useHistory()
  const [mentorshipApplications, setMentorshipApplications] = useState([])
  const { accountId, userType } = user
  const { TabPane } = Tabs
  const [tabKey, setTabKey] = useState('pending')

  const changeTab = key => {
    setTabKey(key)
  }

  const isStudent = userType === 'STUDENT'

  const getApplications = async () => {
    const result = isStudent
      ? await getAllStudentMentorshipApplications(accountId)
      : await getSenseiMentorshipApplications(accountId)
    const data = map(result.contracts, (c, i) => ({ ...c, key: i }))
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

  const cancelApplication = async mentorshipContractId => {
    await cancelMentorshipApplication(mentorshipContractId).then(_data => {
      if (_data) {
        notification.success({ message: 'Success', description: _data.message })
        getApplications()
      }
    })
  }

  useEffect(() => {
    getApplications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId])

  const editApplication = application => {
    history.push({
      pathname: `/student/mentorship/apply/${application.mentorshipListingId}`,
      state: application, // location state
    })
  }

  const senseiTableColumns = [
    {
      title: 'Date Received',
      dataIndex: 'createdAt',
      key: 'createdAt',
      responsive: ['md'],
      render: createdAt => formatTime(createdAt),
    },
    {
      title: 'Mentorship Title',
      dataIndex: 'MentorshipListing',
      key: 'MentorshipListing',
      render: record => <span>{record.name}</span>,
    },
    {
      title: 'Student Name',
      dataIndex: 'Student',
      key: 'studentName',
      responsive: ['sm'],
      render: record => {
        return (
          <span>
            {record.firstName} {record.lastName}
          </span>
        )
      },
    },
    {
      title: 'Mentorship Listing ID',
      dataIndex: 'mentorshipListingId',
      key: 'mentorshipListingId',
      responsive: ['lg'],
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
              title="Are you sure you wish to accept this application？"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => acceptApplication(record.mentorshipContractId)}
            >
              <Button type="primary" shape="circle" size="large" icon={<CheckOutlined />} />
            </Popconfirm>
          )}
          {record.senseiApproval === 'PENDING' && (
            <Popconfirm
              title="Are you sure you wish to reject this application？"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => rejectApplication(record.mentorshipContractId)}
            >
              <Button type="danger" shape="circle" size="large" icon={<CloseOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  const studentTableColumns = [
    {
      title: 'Date Applied',
      dataIndex: 'createdAt',
      key: 'createdAt',
      responsive: ['md'],
      render: createdAt => formatTime(createdAt),
    },
    {
      title: 'Mentorship Title',
      dataIndex: 'MentorshipListing',
      key: 'MentorshipListing.name',
      responsive: ['md'],
      render: listing => (
        <a
          href="#"
          onClick={() => history.push(`/student/mentorship/view/${listing.mentorshipListingId}`)}
          className="text-primary"
        >
          {listing.name}
        </a>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'senseiApproval',
      key: 'senseiApproval',
      responsive: ['md'],
      render: senseiApproval => {
        let color
        if (senseiApproval === MENTORSHIP_CONTRACT_APPROVAL.APPROVED) {
          color = 'success'
        } else if (senseiApproval === MENTORSHIP_CONTRACT_APPROVAL.PENDING) {
          color = 'warning'
        } else {
          color = 'error'
        }
        return <Tag color={color}>{senseiApproval}</Tag>
      },
    },
    {
      title: 'Mentorship Application ID',
      dataIndex: 'mentorshipContractId',
      key: 'mentorshipContractId',
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
          <Button
            block
            type="primary"
            size="large"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => editApplication(record)}
          />
          {record.senseiApproval === 'PENDING' && (
            <Popconfirm
              title="Are you sure you wish to cancel your application?"
              icon={<QuestionCircleOutlined className="text-danger" />}
              onConfirm={() => cancelApplication(record.mentorshipContractId)}
            >
              <Button type="danger" shape="circle" size="large" icon={<CloseOutlined />} />
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
            isStudent ? studentTableColumns : senseiTableColumns,
          )}
        {tabKey === 'approved' &&
          showApplications(
            'approved',
            filter(mentorshipApplications, ['senseiApproval', 'APPROVED']),
            isStudent ? studentTableColumns : senseiTableColumns,
          )}
        {tabKey === 'rejected' &&
          showApplications(
            'rejected',
            filter(mentorshipApplications, ['senseiApproval', 'REJECTED']),
            isStudent ? studentTableColumns : senseiTableColumns,
          )}
      </div>
    </div>
  )
}

const showApplications = (applicationStatus, dataSource, columns) => {
  const numApplications = size(dataSource)
  const isRenderEmpty = numApplications === 0

  const customizeRenderEmpty = () => (
    <div className="text-center">
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
      <div className="row justify-content-between align-items-center mt-2">
        <div className="col-auto">
          You currently have {numApplications} {renderStyledStatus(applicationStatus)} mentorship{' '}
          {numApplications === 1 ? 'application' : 'applications'}.
        </div>
      </div>
      <ConfigProvider renderEmpty={isRenderEmpty && customizeRenderEmpty}>
        <Table className="mt-4" dataSource={dataSource} columns={columns} />
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

  const handleCancel = () => {
    setIsViewStatementModalVisible(false)
  }

  const footer = (
    <div className="row justify-content-end">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setIsViewStatementModalVisible(false)}>
          Close
        </Button>
      </div>
    </div>
  )

  return (
    <div>
      <Button
        ghost
        type="primary"
        shape="circle"
        size="large"
        icon={<EyeOutlined />}
        onClick={showModal}
      />
      <Modal
        title="View Personal Statement"
        visible={isViewStatementModalVisible}
        cancelText="Close"
        onCancel={handleCancel}
        okButtonProps={{ style: { display: 'none' } }}
        footer={footer}
      >
        {record.statement}
      </Modal>
    </div>
  )
}

export default MentorshipApplicationsTable
