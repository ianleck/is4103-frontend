import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Popconfirm, Space, Table, Tooltip } from 'antd'
import { formatTime, showNotification } from 'components/utils'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { ADMIN_VERIFIED_ENUM } from 'constants/constants'
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from 'services/courses'
import { isNil, map } from 'lodash'
import {
  SUCCESS,
  ERROR,
  ANNOUNCEMENT_CREATED_SUCCESS,
  ANNOUNCEMENT_CREATED_ERR,
  ANNOUNCEMENT_EDIT_SUCCESS,
  ANNOUNCEMENT_EDIT_ERR,
  ANNOUNCEMENT_DEL_SUCCESS,
  ANNOUNCEMENT_DEL_ERR,
} from 'constants/notifications'

const CourseAnnouncements = ({ currentCourse, isCourseCreated }) => {
  const { TextArea } = Input

  const [announcements, setAnnouncements] = useState([])
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false)
  const [showEditAnnouncement, setShowEditAnnouncement] = useState(false)
  const [currentAnnouncement, setCurrentAnnouncement] = useState('')

  const [editAnnouncementForm] = Form.useForm()

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const announcementTableCols = [
    {
      title: 'Created At',
      key: 'created_at',
      dataIndex: 'created_at',
      width: '10%',
      responsive: ['lg'],
      render: record => formatTime(record),
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
      width: '20%',
      sorter: (a, b) => a.title.length - b.title.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: record => <EditAnnouncementButtons record={record} />,
    },
  ]

  const addAnnouncementFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button
          type="default"
          size="large"
          onClick={() => setShowAddAnnouncement(false)}
          className=""
        >
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button
          type="primary"
          form="addAnnouncementForm"
          htmlType="submit"
          size="large"
          className=""
        >
          Add
        </Button>
      </div>
    </div>
  )

  const editAnnouncementFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button
          type="default"
          size="large"
          onClick={() => setShowEditAnnouncement(false)}
          className=""
        >
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="editAnnouncementForm" htmlType="submit" size="large">
          Update
        </Button>
      </div>
    </div>
  )

  const EditAnnouncementButtons = data => {
    console.log(data)
    const { record } = data
    return (
      <Space size="middle">
        <Button
          type="primary"
          size="large"
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => handleEditAnnouncement(record)}
          disabled={currentCourse.adminVerified === ADMIN_VERIFIED_ENUM.PENDING}
        />
        <Popconfirm
          title="Do you wish to delete this announcement?"
          onConfirm={() => removeAnnouncement(record)}
          okText="Delete"
          okType="danger"
        >
          <Button
            type="danger"
            size="large"
            shape="circle"
            icon={<DeleteOutlined />}
            disabled={currentCourse.adminVerified === ADMIN_VERIFIED_ENUM.PENDING}
          />
        </Popconfirm>
      </Space>
    )
  }

  const handleEditAnnouncement = record => {
    setCurrentAnnouncement(record)
    editAnnouncementForm.setFieldsValue({
      editAnnouncementTitle: record.title,
      editAnnouncementDescription: record.description,
    })
    setShowEditAnnouncement(true)
  }

  const onAddAnnouncement = async values => {
    console.log('values', values)
    const formValues = {
      title: values.addAnnouncementTitle,
      description: values.addAnnouncementDescription,
    }
    const result = await createAnnouncement(currentCourse.courseId, formValues)
    if (result && !isNil(result.message)) {
      if (result.announcement) {
        getCourseAnnouncements()
        setShowAddAnnouncement(false)
        showNotification('success', SUCCESS, ANNOUNCEMENT_CREATED_SUCCESS)
      }
      showNotification('error', ERROR, ANNOUNCEMENT_CREATED_ERR)
    }
  }

  const onEditAnnouncement = async values => {
    console.log('values', values)
    const formValues = {
      title: values.editAnnouncementTitle,
      description: values.editAnnouncementDescription,
    }
    const result = await updateAnnouncement(currentAnnouncement.announcementId, formValues)
    if (result && !isNil(result.message)) {
      if (result.announcement) {
        getCourseAnnouncements()
        setShowEditAnnouncement(false)
        showNotification('success', SUCCESS, ANNOUNCEMENT_EDIT_SUCCESS)
      } else {
        showNotification('error', ERROR, ANNOUNCEMENT_EDIT_ERR)
      }
    }
  }

  const getCourseAnnouncements = async () => {
    const result = await getAnnouncements(currentCourse.courseId)
    if (result && !isNil(result.message)) {
      if (result.announcements) {
        const announcementData = map(result.announcements, res => ({
          ...res,
          key: res.announcementId,
        }))
        setAnnouncements(
          announcementData.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          ),
        )
      }
    }
  }

  const removeAnnouncement = async record => {
    const result = await deleteAnnouncement(record.announcementId)
    console.log('delAnnouncement', result)
    if (result && !isNil(result.message)) {
      getCourseAnnouncements()
      showNotification('success', SUCCESS, ANNOUNCEMENT_DEL_SUCCESS)
    } else {
      showNotification('error', ERROR, ANNOUNCEMENT_DEL_ERR)
    }
  }

  useEffect(() => {
    getCourseAnnouncements()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="row">
      <div className="col-12 text-right">
        <Tooltip
          visible={!isCourseCreated}
          title="Please save your course as a draft before adding announcements."
        >
          <Button
            disabled={
              !isCourseCreated || currentCourse.adminVerified === ADMIN_VERIFIED_ENUM.PENDING
            }
            type="primary"
            size="large"
            shape="round"
            icon={<PlusOutlined />}
            onClick={() => setShowAddAnnouncement(true)}
          >
            Add Announcement
          </Button>
        </Tooltip>
      </div>
      <div className="col-12 mt-4">
        <Table
          bordered
          className="w-100"
          columns={announcementTableCols}
          dataSource={announcements}
        />
      </div>
      <Modal
        title="Add Notification"
        visible={showAddAnnouncement}
        cancelText="Close"
        centered
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowAddAnnouncement(false)}
        footer={addAnnouncementFooter}
      >
        <Form
          id="addAnnouncementForm"
          layout="vertical"
          hideRequiredMark
          onSubmit={e => e.preventDefault()}
          onFinish={onAddAnnouncement}
          onFinishFailed={onFinishFailed}
        >
          <div className="row">
            <div className="col-12">
              <Form.Item
                name="addAnnouncementTitle"
                label="Title"
                rules={[{ required: true, message: 'Please input your notification title.' }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-12">
              <Form.Item
                name="addAnnouncementDescription"
                label="Description"
                rules={[{ required: true, message: 'Please input your notification content.' }]}
              >
                <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Edit Notification"
        visible={showEditAnnouncement}
        cancelText="Close"
        centered
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowEditAnnouncement(false)}
        footer={editAnnouncementFooter}
      >
        <Form
          form={editAnnouncementForm}
          id="editAnnouncementForm"
          layout="vertical"
          hideRequiredMark
          onSubmit={e => e.preventDefault()}
          onFinish={onEditAnnouncement}
          onFinishFailed={onFinishFailed}
        >
          <div className="row">
            <div className="col-12">
              <Form.Item
                name="editAnnouncementTitle"
                label="Title"
                rules={[{ required: true, message: 'Please input your notification title.' }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-12">
              <Form.Item
                name="editAnnouncementDescription"
                label="Description"
                rules={[{ required: true, message: 'Please input your notification content.' }]}
              >
                <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default CourseAnnouncements
