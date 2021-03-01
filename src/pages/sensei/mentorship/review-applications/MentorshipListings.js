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
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSenseiMentorshipListings } from 'services/mentorshipListing'

const MentorshipListings = () => {
  const user = useSelector(state => state.user)
  const [mentorshipListings, setMentorshipListings] = useState([])
  const { accountId } = user

  const getListings = useCallback(async () => {
    const result = await getSenseiMentorshipListings(accountId)
    const listingRecords = map(result, res => ({ ...res, key: indexOf(result, res) }))
    setMentorshipListings(listingRecords)
  }, [accountId])

  useEffect(() => {
    getListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const dispatch = useDispatch()
  const [tabKey, setTabKey] = useState('listing')

  const { TabPane } = Tabs
  const changeTab = key => {
    setTabKey(key)
  }

  const deleteListing = mentorshipListingId => {
    dispatch({
      type: 'mentorship/DELETE_LISTING',
      payload: mentorshipListingId,
    })
  }
  // const categoryMapping = [
  //   { id: '001', categoryName: 'Finance' },
  //   { id: '002', categoryName: 'IT' },
  //   { id: '003', categoryName: 'Health' },
  // ]
  // const categoryMappingWithKeys = keyBy(categoryMapping, 'id')
  // for table
  // TO DO: get from state eventually
  // const data = [
  //   {
  //     key: '1',
  //     mentorshipListingId: 'MENT001',
  //     categories: ['001', '002'],
  //     title: 'Becoming a financial consultant',
  //     description: 'blah blah blah',
  //   },
  //   {
  //     key: '2',
  //     mentorshipListingId: 'MENT002',
  //     categories: ['003'],
  //     title: 'Thriving in graphics design industry',
  //     description: 'blah blah blah',
  //   },
  // ]

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
            <ListingButton data={record} />
          </div>
          <Popconfirm
            title="Are you sure to delete？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => deleteListing(record)}
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
        {tabKey === 'listing' && showListingSection(mentorshipListings, tableColumns)}
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
  const dispatch = useDispatch()
  const listingRecord = data.data
  const isUpdate = !isNil(listingRecord)
  const [visible, setVisible] = useState(false)

  const onSubmit = values => {
    if (!isUpdate) {
      dispatch({ type: 'mentorship/CREATE_LISTING', payload: values })
    } else {
      dispatch({ type: 'mentorship/UPDATE_LISTING', payload: values })
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
  const { Option } = Select

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
        onFinish={() => console.log('success - added new listing')}
        onFinishFailed={() => console.log('failed')}
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
