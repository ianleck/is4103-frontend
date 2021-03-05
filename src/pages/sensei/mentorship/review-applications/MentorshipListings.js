import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import {
  Button,
  ConfigProvider,
  Empty,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
} from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { indexOf, isNil, map, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  createMentorshipListing,
  deleteMentorshipListing,
  getSenseiMentorshipListings,
  updateMentorshipListing,
} from 'services/mentorshipListing'

const MentorshipListings = () => {
  const user = useSelector(state => state.user)
  const [mentorshipListings, setMentorshipListings] = useState([])
  const { accountId } = user

  const getListings = async () => {
    const result = await getSenseiMentorshipListings(accountId)
    const listingRecords = map(result, res => ({ ...res, key: indexOf(result, res) }))
    setMentorshipListings(listingRecords)
  }

  useEffect(() => {
    const getListingsEffect = async () => {
      const result = await getSenseiMentorshipListings(accountId)
      const listingRecords = map(result, res => ({ ...res, key: indexOf(result, res) }))
      setMentorshipListings(listingRecords)
    }
    getListingsEffect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [tabKey, setTabKey] = useState('listing')

  const { TabPane } = Tabs
  const changeTab = key => {
    setTabKey(key)
  }

  const deleteListing = mentorshipListingId => {
    deleteMentorshipListing(mentorshipListingId).then(_data => {
      if (_data) {
        notification.success({ message: 'Success', description: _data.message })
        getListings()
      }
    })
  }

  const tableColumns = [
    {
      title: 'Mentorship Listing ID',
      dataIndex: 'mentorshipListingId',
      key: 'mentorshipListingId',
    },

    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      responsive: ['sm'],
    },
    {
      title: 'Categories',
      key: 'Categories',
      dataIndex: 'Categories',
      responsive: ['md'],
      render: categories => (
        <>
          {categories.map(category => {
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
      responsive: ['lg'],
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="large">
          <div>
            <ListingButton data={record} getListings={getListings} />
          </div>
          <Popconfirm
            title="Are you sure you wish to delete this listing？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => deleteListing(record.mentorshipListingId)}
          >
            <Button type="danger" shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
          ,
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
        {tabKey === 'listing' && showListingSection(mentorshipListings, tableColumns, getListings)}
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

const showListingSection = (dataSource, columns, getListings) => {
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
            <ListingButton data={null} getListings={getListings} />
          </div>
        </div>
      </div>
      <ConfigProvider renderEmpty={isRenderEmpty && customizeRenderEmpty}>
        <Table dataSource={dataSource} columns={columns} />
      </ConfigProvider>
    </div>
  )
}

const ListingButton = property => {
  const { data, getListings } = property
  const listingRecord = data
  const isUpdate = !isNil(listingRecord)
  const [visible, setVisible] = useState(false)

  const onSubmit = values => {
    if (!isUpdate) {
      createMentorshipListing({ ...values }).then(_data => {
        if (_data) {
          notification.success({ message: _data.message })
          getListings()
        }
      })

      // dispatch({ type: 'mentorship/CREATE_LISTING', payload: values })
    } else {
      updateMentorshipListing(values).then(_data => {
        if (_data) {
          notification.success({ message: _data.message })
          getListings()
        }
      })
      // dispatch({ type: 'mentorship/UPDATE_LISTING', payload: values })
    }
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
  const categories = useSelector(state => state.categories)
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      categories: map(record.Categories, c => c.categoryId),
    })
  })
  const { Option } = Select

  return (
    <Modal
      forceRender
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
            let payload = values
            if (record) {
              payload = {
                mentorshipListingId: record.mentorshipListingId,
                ...payload,
              }
            }
            onSubmit(payload)
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
        initialValues={
          !!record && {
            name: record.name,
            description: record.description,
            categories: record.Categories.map(c => c.categoryId),
          }
        }
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input a name for your mentorship listing!' }]}
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
  )
}

export default MentorshipListings
