import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { compact, indexOf, isEmpty, isNil, map, size } from 'lodash'
import {
  getSenseiMentorshipListings,
  createMentorshipListing,
  updateMentorshipListing,
  deleteMentorshipListing,
} from 'services/mentorship/listings'
import { VISIBILITY_ENUM } from 'constants/constants'
import { VISIBILITY_ENUM_FILTER } from 'constants/filters'
import { onFinishFailed, showNotification } from 'components/utils'
import {
  ERROR,
  MTS_LISTING_CREATE_SUCCESS,
  MTS_LISTING_UPDATE_ERR,
  MTS_LISTING_UPDATE_SUCCESS,
  SUCCESS,
} from 'constants/notifications'

const SenseiMentorshipListings = () => {
  const user = useSelector(state => state.user)
  const categories = useSelector(state => state.categories)
  const { accountId } = user

  const { TextArea } = Input
  const { Option } = Select
  const { Paragraph } = Typography
  const [addListingForm] = Form.useForm()
  const [editListingForm] = Form.useForm()

  const [mentorshipListings, setMentorshipListings] = useState([])
  const [currentListing, setCurrentListing] = useState('')
  const numMentorshipListings = size(mentorshipListings)

  const [showAddListingModal, setShowAddListingModal] = useState(false)
  const [showEditListingModal, setShowEditListingModal] = useState(false)
  const categoryFilters = map(categories, cat => ({ value: cat.categoryId, text: cat.name }))

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

  const onAddListing = async values => {
    if (values.visibility) {
      values.visibility = VISIBILITY_ENUM.PUBLISHED
    } else {
      values.visibility = VISIBILITY_ENUM.HIDDEN
    }
    const response = await createMentorshipListing({ ...values })
    if (response && !isNil(response.createdListing)) {
      showNotification('success', SUCCESS, MTS_LISTING_CREATE_SUCCESS)
      getListings()
      addListingForm.resetFields()
      setShowAddListingModal(false)
    }
    // the warning notification will be triggered by the backend as it gives an informative error message
  }

  const onEditListing = async values => {
    values.mentorshipListingId = currentListing.mentorshipListingId

    if (values.visibility) {
      values.visibility = VISIBILITY_ENUM.PUBLISHED
    } else {
      values.visibility = VISIBILITY_ENUM.HIDDEN
    }
    const response = await updateMentorshipListing({ ...values })
    if (response && !isNil(response.updatedListing)) {
      showNotification('success', SUCCESS, MTS_LISTING_UPDATE_SUCCESS)
      getListings()
      setShowEditListingModal(false)
    } else {
      showNotification('error', ERROR, MTS_LISTING_UPDATE_ERR)
    }
  }

  const handleEditListing = record => {
    setCurrentListing(record)
    const isChecked = record.visibility === VISIBILITY_ENUM.PUBLISHED

    editListingForm.setFieldsValue({
      name: record.name,
      description: record.description,
      categories: record.Categories.map(c => c.categoryId),
      priceAmount: record.priceAmount,
      visibility: isChecked,
    })
    setShowEditListingModal(true)
  }

  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend', 'descend'],
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
      filters: categoryFilters,
      onFilter: (value, record) => {
        return !isEmpty(compact(record.Categories.map(c => c.categoryId.indexOf(value) === 0)))
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: record => {
        return (
          <Paragraph
            ellipsis={{
              rows: 1,
              expandable: true,
              symbol: 'More',
            }}
          >
            {record}
          </Paragraph>
        )
      },
    },
    {
      title: 'Pass Price (S$)',
      dataIndex: 'priceAmount',
      key: 'priceAmount',
      responsive: ['lg'],
      render: record => record.toFixed(2),
      sorter: (a, b) => a.priceAmount - b.priceAmount,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Visibility',
      dataIndex: 'visibility',
      key: 'visibility',
      responsive: ['md'],
      filters: VISIBILITY_ENUM_FILTER,
      onFilter: (value, record) => record.visibility.indexOf(value) === 0,
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
                <span className="h5 mb-0">Mentorship Listings</span>
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
                  {numMentorshipListings === 1 ? '' : 's'}.
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
            <Select
              showSearch
              mode="multiple"
              size="large"
              filterOption={(input, option) => {
                return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }}
              placeholder="Please select at least 1 relevant category."
            >
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
          <Form.Item
            label="Mentorship pass price (S$)"
            name="priceAmount"
            rules={[{ required: true, message: 'Please add a mentorship pass price.' }]}
          >
            <InputNumber
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              step="0.01"
              min={0}
              precision={2}
              className="w-50"
            />
          </Form.Item>
          <Form.Item label="Visibility" name="visibility" valuePropName="checked">
            <Switch
              checkedChildren={VISIBILITY_ENUM.PUBLISHED}
              unCheckedChildren={VISIBILITY_ENUM.HIDDEN}
            />
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
          <Form.Item
            label="Mentorship Pass price (S$)"
            name="priceAmount"
            rules={[{ required: true, message: 'Please add a mentorship pass price.' }]}
          >
            <InputNumber
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              step="0.01"
              min={0}
              precision={2}
              className="w-50"
            />
          </Form.Item>
          <Form.Item label="Visibility" name="visibility" valuePropName="checked">
            <Switch
              checkedChildren={VISIBILITY_ENUM.PUBLISHED}
              unCheckedChildren={VISIBILITY_ENUM.HIDDEN}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SenseiMentorshipListings
