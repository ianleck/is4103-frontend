import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  ConfigProvider,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Switch,
  Table,
  Tabs,
} from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { size } from 'lodash'
import React, { useState } from 'react'

const MentorshipListings = () => {
  const { TabPane } = Tabs
  const [tabKey, setTabKey] = useState('listing')

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
      title: 'Becoming a financial consultant',
      duration: '3',
      quota: '2',
      description: 'blah blah blah',
    },
    {
      key: '2',
      mentorshipListingId: 'MENT002',
      category: 'Digital Illustration',
      title: 'Thriving in graphics design industry',
      duration: '6',
      quota: '3',
      description: 'blah blah blah',
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
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      responsive: ['md'],
    },
    {
      title: 'Duration (months)',
      dataIndex: 'duration',
      key: 'duration',
      responsive: ['md'],
    },
    {
      title: 'Quota',
      dataIndex: 'quota',
      key: 'quota',
      responsive: ['lg'],
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="large">
          <div>
            <UpdateListingButton record={record} />
          </div>
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ]

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5 className="mb-0">Mentorship Listing</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="About" key="about" />
          <TabPane tab="Listings" key="listing" />
        </Tabs>
      </div>
      <div className="card-body">
        {tabKey === 'about' && showAboutSection()}
        {tabKey === 'listing' && showListingSection(data, tableColumns)}
      </div>
    </div>
  )
}

const showAboutSection = () => {
  return (
    <div className="row justify-content-start">
      <div className="col-auto">
        <Switch checkedChildren="ON" unCheckedChildren="OFF" />
      </div>
      <div className="col-auto">Make your mentor profile available for mentorships</div>
    </div>
  )
}

const showListingSection = (dataSource, columns) => {
  const numMentorshipListings = size(dataSource)
  const isRenderEmpty = numMentorshipListings === 0
  const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center' }}>
      <Empty />
    </div>
  )
  return (
    <div>
      <div className="row justify-content-between align-items-center mb-3">
        <div className="col-auto">
          <div>You currently have {numMentorshipListings} mentorship listings.</div>
        </div>

        <div className="col-auto">
          <div>
            <AddNewListingButton />
          </div>
        </div>
      </div>
      <ConfigProvider renderEmpty={isRenderEmpty && customizeRenderEmpty}>
        <Table dataSource={dataSource} columns={columns} />
      </ConfigProvider>
    </div>
  )
}

const AddNewListingButton = () => {
  const [isNewListingModalVisible, setIsNewListingModalVisible] = useState(false)
  const showModal = () => {
    setIsNewListingModalVisible(true)
  }

  const handleOk = () => {
    // dispatch action to create new mentorship listing
    setIsNewListingModalVisible(false)
  }

  const handleCancel = () => {
    setIsNewListingModalVisible(false)
  }
  return (
    <div>
      <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={showModal}>
        New Listing
      </Button>
      <Modal
        title="Add New Mentorship Listing"
        visible={isNewListingModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {showListingForm()}
      </Modal>
    </div>
  )
}

const UpdateListingButton = values => {
  const { record } = values
  const [isUpdateListingModalVisible, setIsUpdateListingModalVisible] = useState(false)

  const showModal = () => {
    setIsUpdateListingModalVisible(true)
  }

  const handleOk = () => {
    // dispatch action to create new mentorship listing
    setIsUpdateListingModalVisible(false)
  }

  const handleCancel = () => {
    setIsUpdateListingModalVisible(false)
  }
  return (
    <div>
      <Button
        type="primary"
        shape="circle"
        icon={<EditOutlined />}
        onClick={() => showModal(record)}
      />
      <Modal
        title="Update Mentorship Listing"
        visible={isUpdateListingModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {showListingForm(record)}
      </Modal>
    </div>
  )
}

const showListingForm = record => {
  return (
    <Form
      layout="vertical"
      hideRequiredMark
      onFinish={() => console.log('success - added new listing')}
      onFinishFailed={() => console.log('failed')}
      initialValues={
        !!record && {
          title: record.title,
          description: record.description,
          quota: record.quota,
          duration: record.duration,
          category: record.category,
        }
      }
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please input a title!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please input a description!' }]}
      >
        <TextArea
          placeholder="Tell us more about what the mentorship entails"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>
      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: 'Please input a category!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Quota"
        name="quota"
        rules={[{ required: true, message: 'Please input a numerical value!' }]}
      >
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item
        label="Duration (months)"
        name="duration"
        rules={[{ required: true, message: 'Please input a numerical value!' }]}
      >
        <InputNumber min={1} />
      </Form.Item>
    </Form>
  )
}

export default MentorshipListings
