import {
  CloseOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  EditOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { Button, Modal, notification, Popconfirm, Space, Table, Tabs, Tag } from 'antd'
import { filter, isNil, map, size } from 'lodash'
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
import { formatTime, showNotification } from 'components/utils'
import {
  ERROR,
  MTS_APP_APPROVE_ERR,
  MTS_APP_APPROVE_SUCCESS,
  SUCCESS,
} from 'constants/notifications'
import EmailAcceptanceModal from '../EmailAcceptanceModal'

const MentorshipApplicationsTable = () => {
  const user = useSelector(state => state.user)
  const history = useHistory()
  const [mentorshipApplications, setMentorshipApplications] = useState([])
  const [tabKey, setTabKey] = useState('pending')

  const { accountId, userType } = user
  const { TabPane } = Tabs

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

  const rejectApplication = mentorshipContractId => {
    rejectMentorshipApplication(mentorshipContractId).then(res => {
      if (res) {
        notification.success({ message: res.message })
        getApplications()
        changeTab('rejected')
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

  const ViewEmailParamsButton = ({ mentorshipContractId }) => {
    const [showEmailParamsModal, setShowEmailParamsModal] = useState(false)
    const [activeMentorshipContractId, setActiveMentorshipContractId] = useState('')

    const acceptApplication = async values => {
      const payload = {
        mentorshipContractId: activeMentorshipContractId,
        body: {
          numSlots: values.numSlots,
          duration: values.duration,
          message: values.message,
        },
      }

      const response = await acceptMentorshipApplication(payload)

      if (response && !isNil(response.mentorshipContract)) {
        showNotification('success', SUCCESS, MTS_APP_APPROVE_SUCCESS)
        getApplications()
        changeTab('approved')
      } else {
        showNotification('error', ERROR, MTS_APP_APPROVE_ERR)
      }
    }

    const handleOnClick = () => {
      setActiveMentorshipContractId(mentorshipContractId)
      setShowEmailParamsModal(true)
    }
    return (
      <>
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<CheckOutlined />}
          onClick={() => handleOnClick()}
        />
        <EmailAcceptanceModal
          isVisible={showEmailParamsModal}
          onSubmitEmailParams={acceptApplication}
          setShowEmailParamsModal={setShowEmailParamsModal}
        />
      </>
    )
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
            <ViewMentorshipApplicationButton record={record} />
          </div>
          {record.senseiApproval === 'PENDING' && (
            <ViewEmailParamsButton mentorshipContractId={record.mentorshipContractId} />
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
            <ViewMentorshipApplicationButton record={record} />
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
      <Table className="mt-4" dataSource={dataSource} columns={columns} />
    </div>
  )
}

const ViewMentorshipApplicationButton = values => {
  const { record } = values
  const [isViewApplicationModalVisible, setIsViewApplicationModalVisible] = useState(false)

  const showModal = () => {
    setIsViewApplicationModalVisible(true)
  }

  const handleCancel = () => {
    setIsViewApplicationModalVisible(false)
  }

  const footer = (
    <div className="row justify-content-end">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setIsViewApplicationModalVisible(false)}>
          Close
        </Button>
      </div>
    </div>
  )

  const ItemCard = ({ header, children }) => (
    <div className="card">
      <div className="card-body">
        <div className="card-title font-weight-bold text-dark">{header}</div>
        <hr />
        {children}
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
        title="View Mentorship Application"
        visible={isViewApplicationModalVisible}
        cancelText="Close"
        onCancel={handleCancel}
        okButtonProps={{ style: { display: 'none' } }}
        footer={footer}
      >
        <div className="mentorship-application-modal-body overflow-y-scroll">
          <ItemCard header="Application Reason">
            {record.applicationFields.applicationReason}
          </ItemCard>
          <ItemCard header="Goals">{record.applicationFields.goals}</ItemCard>
          <ItemCard header="Steps Taken (Optional)">
            {record.applicationFields.stepsTaken ? record.applicationFields.stepsTaken : '-'}
          </ItemCard>
          <ItemCard header="Ideal Duration (Optional)">
            {record.applicationFields.idealDuration ? record.applicationFields.idealDuration : '-'}
          </ItemCard>
          <ItemCard header="Additional Remarks (Optional)">
            {record.applicationFields.additionalInfo
              ? record.applicationFields.additionalInfo
              : '-'}
          </ItemCard>
        </div>
      </Modal>
    </div>
  )
}

export default MentorshipApplicationsTable
