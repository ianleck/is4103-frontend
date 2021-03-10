import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { indexOf, map, size } from 'lodash'
import {
  getSenseiMentorshipListings,
  createMentorshipListing,
  updateMentorshipListing,
  deleteMentorshipListing,
} from 'services/mentorshipListing'

const SenseiMentorshipListings = () => {
  const user = useSelector(state => state.user)
  const categories = useSelector(state => state.categories)
  const { accountId } = user

  const { TextArea } = Input
  const { Option } = Select
  const [addListingForm] = Form.useForm()
  const [editListingForm] = Form.useForm()

  const [mentorshipListings, setMentorshipListings] = useState([])
  const [currentListing, setCurrentListing] = useState('')
  const numMentorshipListings = size(mentorshipListings)

  const [showAddListingModal, setShowAddListingModal] = useState(false)
  const [showEditListingModal, setShowEditListingModal] = useState(false)

  const getListings = async () => {
    const result = await getSenseiMentorshipListings(accountId)
    const listingRecords = map(result, res => ({ ...res, key: indexOf(result, res) }))
    setMentorshipListings(listingRecords)
  }

  const deleteListing = mentorshipListingId => {
    deleteMentorshipListing(mentorshipListingId).then(_data => {
      if (_data) {
        notification.success({ message: 'Success', description: _data.message })
        getListings()
      }
    })
  }

  useEffect(() => {
    const getListingsEffect = async () => {
      const result = await getSenseiMentorshipListings(accountId)
      const listingRecords = map(result, res => ({ ...res, key: indexOf(result, res) }))
      setMentorshipListings(listingRecords)
    }
    getListingsEffect()
  }, [accountId])

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const onAddListing = values => {
    createMentorshipListing({ ...values }).then(_data => {
      if (_data) {
        notification.success({ message: _data.message })
        getListings()
        addListingForm.resetFields()
        setShowAddListingModal(false)
      }
    })
  }

  const onEditListing = values => {
    values.mentorshipListingId = currentListing.mentorshipListingId
    updateMentorshipListing({ ...values }).then(_data => {
      if (_data) {
        notification.success({ message: _data.message })
        getListings()
        setShowEditListingModal(false)
      }
    })
  }

  const handleEditListing = record => {
    setCurrentListing(record)
    editListingForm.setFieldsValue({
      name: record.name,
      description: record.description,
      categories: record.Categories.map(c => c.categoryId),
    })
    setShowEditListingModal(true)
  }

  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Categories',
      key: 'Categories',
      dataIndex: 'Categories',
      responsive: ['sm'],
      render: recordCategories => (
        <>
          {recordCategories.map(category => {
            const { name, categoryId } = category
            return (
              <Tag color="geekblue" key={categoryId}>
                {name}
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
        <Space size="middle">
          <Button
            type="primary"
            size="large"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => handleEditListing(record)}
          />
          <Popconfirm
            title="Are you sure you wish to delete this listing？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => deleteListing(record.mentorshipListingId)}
          >
            <Button type="danger" shape="circle" size="large" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const listingFormFooter = isEdit => {
    return (
      <div className="row justify-content-between">
        <div className="col-auto">
          <Button
            type="default"
            size="large"
            onClick={() =>
              isEdit ? setShowEditListingModal(false) : setShowAddListingModal(false)
            }
            className=""
          >
            Close
          </Button>
        </div>
        <div className="col-auto">
          <Button
            type="primary"
            form={isEdit ? 'editListingForm' : 'addListingForm'}
            htmlType="submit"
            size="large"
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <div className="row justify-content-between align-items-center">
              <div className="col-12 col-sm-auto text-center text-sm-left">
                <span className="h5 font-weight-bold text-dark text-uppercase">
                  Mentorship Listings
                </span>
              </div>
              <div className="col-12 col-sm-auto mt-3 mt-sm-0 text-center text-sm-right">
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  icon={<PlusOutlined />}
                  onClick={() => setShowAddListingModal(true)}
                >
                  New Listing
                </Button>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="row justify-content-between align-items-center mb-3">
              <div className="col-12 col-sm-auto text-center text-sm-left">
                <span>
                  You currently have {numMentorshipListings} mentorship listing
                  {numMentorshipListings > 1 ? 's' : ''}.
                </span>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-12">
                <Table className="w-100" dataSource={mentorshipListings} columns={tableColumns} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        visible={showAddListingModal}
        title="Create a New Mentorship Listing"
        cancelText="Close"
        centered
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowAddListingModal(false)}
        footer={listingFormFooter(false)}
      >
        <Form
          id="addListingForm"
          form={addListingForm}
          layout="vertical"
          hideRequiredMark
          onSubmit={e => e.preventDefault()}
          onFinish={onAddListing}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input a name for your mentorship listing.' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input a description.' }]}
          >
            <TextArea
              placeholder="Tell us more about what the mentorship is about."
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>

          <Form.Item
            name="categories"
            label="Categories"
            rules={[
              { required: true, message: 'Please select at least 1 category.', type: 'array' },
            ]}
          >
            <Select mode="multiple" placeholder="Select at least 1 relevant category">
              {map(categories, category => {
                const { categoryId, name } = category
                return (
                  <Option key={categoryId} value={categoryId}>
                    {name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={showEditListingModal}
        title="Update Mentorship Listing"
        cancelText="Close"
        centered
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowEditListingModal(false)}
        footer={listingFormFooter(true)}
      >
        <Form
          id="editListingForm"
          form={editListingForm}
          layout="vertical"
          hideRequiredMark
          onSubmit={e => e.preventDefault()}
          onFinish={onEditListing}
          onFinishFailed={onFinishFailed}
          initialValues={
            !!currentListing && {
              name: currentListing.name,
              description: currentListing.description,
              categories: currentListing.Categories.map(c => c.categoryId),
            }
          }
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input a name for your mentorship listing.' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input a description.' }]}
          >
            <TextArea
              placeholder="Tell us more about what the mentorship is about."
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>

          <Form.Item
            name="categories"
            label="Categories"
            rules={[
              { required: true, message: 'Please select at least 1 category.', type: 'array' },
            ]}
          >
            <Select mode="multiple" placeholder="Select at least 1 relevant category">
              {map(categories, category => {
                const { categoryId, name } = category
                return (
                  <Option key={categoryId} value={categoryId}>
                    {name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SenseiMentorshipListings
