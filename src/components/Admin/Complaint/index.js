import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Table, Tabs, Button, Space, Popconfirm, Modal, Form, Input, Descriptions } from 'antd'
import { getAllComplaints, markComplaintAsResolved, postComplaintReason } from 'services/complaints'
import { deleteComment } from 'services/courses/lessons'
import {
  CheckOutlined,
  DeleteOutlined,
  ExceptionOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import {
  formatTime,
  filterDataByComplaintStatus,
  sortDescAndKeyComplaintId,
  showNotification,
} from 'components/utils'
import StatusTag from 'components/Common/StatusTag'
import { isEmpty, isNil, size } from 'lodash'
import CountIconWidget from 'components/Common/CountIconWidget'
import {
  SUCCESS,
  COMPLAINT_RESOLVED,
  COMPLAINT_COMMENT_DELETE,
  NEW_COMPLAINT_REASON,
} from 'constants/notifications'
import { getProfile } from 'services/user'

const Complaint = () => {
  const { TabPane } = Tabs

  const [allComplaints, setAllComplaints] = useState([])
  const [pendingComplaints, setPendingComplaints] = useState([])
  const [resolvedComplaints, setResolvedComplaints] = useState([])
  const [showAddComplaint, setShowAddComplaint] = useState(false)
  const [showComplaintDetails, setShowComplaintDetails] = useState(false)
  const [complaintDetails, setComplaintDetails] = useState([])
  const [commentAuthor, setCommentAuthor] = useState([])

  const [currentFilter, setCurrentFilter] = useState('all')
  const [currentTableData, setCurrentTableData] = useState([])

  const retrieveComplaints = async () => {
    const result = await getAllComplaints()

    if (result && !isNil(result.complaints)) {
      const keyAllComplaints = sortDescAndKeyComplaintId(result.complaints)
      const keyPendingComplaints = sortDescAndKeyComplaintId(
        filterDataByComplaintStatus(result.complaints, false),
      )
      const keyResolvedComplaints = sortDescAndKeyComplaintId(
        filterDataByComplaintStatus(result.complaints, true),
      )

      setAllComplaints(keyAllComplaints)
      setPendingComplaints(keyPendingComplaints)
      setResolvedComplaints(keyResolvedComplaints)

      switch (currentFilter) {
        case 'all':
          setCurrentTableData(keyAllComplaints)
          break
        case 'pending':
          setCurrentTableData(keyPendingComplaints)
          break
        case 'resolved':
          setCurrentTableData(keyResolvedComplaints)
          break
        default:
          setCurrentTableData(keyAllComplaints)
          break
      }
    }
  }

  const setTableData = filter => {
    if (currentFilter === filter) {
      setCurrentTableData(sortDescAndKeyComplaintId(allComplaints))
      setCurrentFilter('all')
      return
    }
    switch (filter) {
      case 'pending':
        setCurrentTableData(filterDataByComplaintStatus(allComplaints, false))
        break
      case 'resolved':
        setCurrentTableData(filterDataByComplaintStatus(allComplaints, true))
        break
      default:
        setCurrentTableData(allComplaints)
        break
    }
    setCurrentFilter(filter)
  }

  const formatBody = record => {
    if (isNil(record)) {
      return '*Comment has been removed*'
    }
    return record
  }

  const formatAuthor = record => {
    if (isNil(record)) {
      return '-'
    }
    return record
  }

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
      title: 'Comment Body',
      dataIndex: ['Comment', 'body'],
      key: ['Comment', 'body'],
      width: '30%',
      render: record => formatBody(record),
      sorter: (a, b) => a.Comment.body.length - b.Comment.body.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Complaint Reason',
      dataIndex: ['ComplaintReason', 'reason'],
      key: ['ComplaintReason', 'reason'],
      responsive: ['md'],
      width: '15%',
      sorter: (a, b) => a.ComplaintReason.reason.length - b.ComplaintReason.reason.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Author ID',
      dataIndex: ['Comment', 'accountId'],
      key: ['Comment', 'accountId'],
      responsive: ['md'],
      width: '15%',
      render: record => formatAuthor(record),
    },
    {
      title: 'Complaint Status',
      dataIndex: 'isResolved',
      key: 'isResolved',
      width: '10%',
      onFilter: (value, record) => record.isResolved.indexOf(value) === 0,
      render: record => <StatusTag data={{ isResolved: record }} type="COMPLAINT_STATUS_ENUM" />,
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="large">
          <Button
            disabled={record.isResolved}
            type="primary"
            shape="circle"
            size="large"
            onClick={() => showInformation(record)}
            icon={<InfoCircleOutlined />}
          />

          <Popconfirm
            title="Do you wish to delete this comment?"
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            okType="danger"
          >
            <Button
              disabled={record.isResolved}
              danger
              shape="circle"
              size="large"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>

          <Popconfirm
            title="Do you wish to mark this complaint as resolved?"
            onConfirm={() => handleMarkAsResolved(record)}
            okText="Mark as Resolved"
          >
            <Button
              disabled={record.isResolved}
              type="primary"
              shape="circle"
              size="large"
              icon={<CheckOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handlePendingWidgetOnClick = () => {
    setTableData('pending')
  }
  const handlerResolvedWidgetOnClick = () => {
    setTableData('resolved')
  }

  const handleDelete = async record => {
    const response1 = await markComplaintAsResolved(record.complaintId)

    const response2 = await deleteComment(record.Comment.commentId)

    if (response1.success && response2.success) {
      retrieveComplaints()
      showNotification('success', SUCCESS, COMPLAINT_COMMENT_DELETE)
    }
  }

  const handleMarkAsResolved = async record => {
    const response = await markComplaintAsResolved(record.complaintId)
    if (response.success) {
      retrieveComplaints()
      showNotification('success', SUCCESS, COMPLAINT_RESOLVED)
    }
  }

  const addNewComplaintReasonFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <button
          type="button"
          onClick={() => setShowAddComplaint(false)}
          className="btn btn-outline-default"
        >
          Cancel
        </button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="addNewComplaintReasonForm" htmlType="submit" size="large">
          Add new Complaint Reason
        </Button>
      </div>
    </div>
  )

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const onAddNewReason = async values => {
    const payload = { ...values }
    const response = await postComplaintReason(payload)
    if (response.success) {
      showNotification('success', SUCCESS, NEW_COMPLAINT_REASON)
    }
  }

  const showInformation = async record => {
    console.log(record)
    const user = await getProfile(record.Comment.accountId)
    setCommentAuthor(user)
    setComplaintDetails(record)
    setShowComplaintDetails(true)
  }

  const onCloseDetails = () => {
    setShowComplaintDetails(false)
  }

  useEffect(() => {
    retrieveComplaints()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="row">
        <Helmet title="Complaint Management" />
        <div className="col-auto">
          <div className="text-dark text-uppercase h3">
            <strong>Complaint Management</strong>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <Button
            className="float-right"
            type="primary"
            shape="round"
            size="large"
            onClick={() => setShowAddComplaint(true)}
            icon={<PlusCircleOutlined />}
          >
            Add New Complaint Reason
          </Button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12 col-md-6">
          <CountIconWidget
            title="Pending Complaints"
            className={`${currentFilter === 'pending' ? 'btn btn-light' : 'btn'}`}
            count={size(pendingComplaints)}
            icon={<ExceptionOutlined />}
            onClick={handlePendingWidgetOnClick}
            color="red"
          />
        </div>

        <div className="col-12 col-md-6">
          <CountIconWidget
            title="Resolved Complaints"
            className={`${currentFilter === 'resolved' ? 'btn btn-light' : 'btn'}`}
            count={size(resolvedComplaints)}
            icon={<CheckOutlined />}
            onClick={handlerResolvedWidgetOnClick}
            color="green"
          />
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-12">
          <div className="card">
            <div className="card-header card-header-flex">
              <div className="d-flex flex-column justify-content-center mr-auto">
                <h5>List of Complaints</h5>
              </div>
              <Tabs activeKey="Complaints" className="kit-tabs">
                <TabPane tab="Complaints" key="Complaints" />
              </Tabs>
            </div>
            <div className="card-body overflow-x-scroll mr-3 mr-sm-0">
              <Table className="w-100" dataSource={currentTableData} columns={tableColumns} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-lg-12">
        <Modal
          title="Add a New Complaint Reason"
          visible={showAddComplaint}
          cancelText="Close"
          centered
          okButtonProps={{ style: { display: 'none' } }}
          onCancel={() => setShowAddComplaint(false)}
          footer={addNewComplaintReasonFormFooter}
        >
          <Form
            id="addNewComplaintReasonForm"
            layout="vertical"
            hideRequiredMark
            onFinish={onAddNewReason}
            onFinishFailed={onFinishFailed}
          >
            <div className="row">
              <div className="col-md-12">
                <Form.Item
                  name="reason"
                  label="Reason"
                  rules={[{ required: true, message: 'Please input Reason' }]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-md-12">
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: 'Please input Description' }]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Modal>
      </div>

      <div className="col-xl-4 col-lg-12">
        <Modal
          title="Complaint Details"
          visible={showComplaintDetails}
          cancelText="Close"
          centered
          okButtonProps={{ style: { display: 'none' } }}
          onCancel={() => onCloseDetails()}
        >
          <Descriptions column={1}>
            <Descriptions.Item label="Comment ID">{complaintDetails.commentId}</Descriptions.Item>
            <Descriptions.Item label="Comment">
              {!isEmpty(complaintDetails) ? complaintDetails.Comment.body : null}
            </Descriptions.Item>
            <Descriptions.Item label="Comment Author">
              {!isEmpty(commentAuthor)
                ? `${commentAuthor.firstName} ${commentAuthor.lastName}`
                : null}
            </Descriptions.Item>
            <Descriptions.Item label="Complaint ID">
              {complaintDetails.complaintId}
            </Descriptions.Item>
            <Descriptions.Item label="Reporter">
              {!isEmpty(complaintDetails)
                ? `${complaintDetails.User.firstName} ${complaintDetails.User.lastName}`
                : null}
            </Descriptions.Item>
            <Descriptions.Item label="Complaint Reason">
              {!isEmpty(complaintDetails) ? complaintDetails.ComplaintReason.reason : null}
            </Descriptions.Item>
            <Descriptions.Item label="Complaint Created At">
              {formatTime(complaintDetails.createdAt)}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      </div>
    </div>
  )
}

export default Complaint
