import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  ConfigProvider,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
} from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { isNil, keyBy, map, size } from 'lodash'
import React, { useState } from 'react'

const MentorshipListings = () => {
  const { TabPane } = Tabs
  const [tabKey, setTabKey] = useState('listing')

  const changeTab = key => {
    setTabKey(key)
  }

  const categoryMapping = [
    { id: '001', categoryName: 'Finance' },
    { id: '002', categoryName: 'IT' },
    { id: '003', categoryName: 'Health' },
  ]
  const categoryMappingWithKeys = keyBy(categoryMapping, 'id')
  // for table
  // TO DO: get from state eventually
  const data = [
    {
      key: '1',
      mentorshipListingId: 'MENT001',
      categories: ['001', '002'],
      title: 'Becoming a financial consultant',
      description: 'blah blah blah',
    },
    {
      key: '2',
      mentorshipListingId: 'MENT002',
      categories: ['003'],
      title: 'Thriving in graphics design industry',
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
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      responsive: ['sm'],
    },
    {
      title: 'Categories',
      key: 'categories',
      dataIndex: 'categories',
      responsive: ['md'],
      render: categories => (
        <>
          {categories.map(categoryId => {
            return (
              <Tag color="geekblue" key={categoryId}>
                {categoryMappingWithKeys[categoryId].categoryName}
              </Tag>
            )
          })}
        </>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      responsive: ['lg'],
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="large">
          <div>
            <ListingButton data={record} />
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
            <ListingButton data={null} />
          </div>
        </div>
      </div>
      <ConfigProvider renderEmpty={isRenderEmpty && customizeRenderEmpty}>
        <Table dataSource={dataSource} columns={columns} />
      </ConfigProvider>
    </div>
  )
}

const ListingButton = data => {
  const listingRecord = data.data
  const isUpdate = !isNil(listingRecord)

  const [visible, setVisible] = useState(false)

  const onSubmit = values => {
    console.log('Received values of form: ', values)
    setVisible(false)
  }
  return (
    <div>
      <Button
        type="primary"
        shape={isUpdate ? 'circle' : 'round'}
        icon={isUpdate ? <EditOutlined /> : <PlusOutlined />}
        onClick={() => setVisible(true)}
      >
        {!isUpdate && 'New Listing'}
      </Button>
      <ListingForm
        visible={visible}
        onSubmit={onSubmit}
        onCancel={() => setVisible(false)}
        record={isUpdate && listingRecord}
      />
    </div>
  )
}

const ListingForm = ({ record, visible, onSubmit, onCancel }) => {
  const [form] = Form.useForm()
  const { Option } = Select
  const categories = [
    { id: '001', categoryName: 'Finance' },
    { id: '002', categoryName: 'IT' },
    { id: '003', categoryName: 'Health' },
  ]

  return (
    <Modal
      visible={visible}
      title={record ? 'Update mentorship listing' : 'Create a new mentorship listing'}
      okText={record ? 'Update' : 'Create'}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields()
            onSubmit(values)
          })
          .catch(info => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout="vertical"
        hideRequiredMark
        onFinish={() => console.log('success - added new listing')}
        onFinishFailed={() => console.log('failed')}
        initialValues={
          !!record && {
            title: record.title,
            description: record.description,
            categories: record.categories,
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
          name="categories"
          label="Categories"
          rules={[{ required: true, message: 'Please select at least 1 category!', type: 'array' }]}
        >
          <Select mode="multiple" placeholder="Select at least 1 relevant category">
            {map(categories, category => {
              const { id, categoryName } = category
              return (
                <Option key={id} value={id}>
                  {categoryName}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MentorshipListings
