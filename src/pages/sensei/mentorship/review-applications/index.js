import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Space, Switch, Table, Tabs } from 'antd'
import Form from 'antd/lib/form/Form'
import Modal from 'antd/lib/modal/Modal'
import { size } from 'lodash'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

const ReviewApplications = () => {
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
      duration: '3',
      quota: '2',
    },
    {
      key: '2',
      mentorshipListingId: 'MENT002',
      category: 'Digital Illustration',
      duration: '6',
      quota: '3',
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
      render: () => (
        <Space size="large">
          <Button type="primary" shape="circle" icon={<EditOutlined />} />
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Helmet title="Mentorship | Review Applications" />
      <div className="row">
        <div className="col-xl-12 col-lg-12">
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
        </div>
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
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  )
}

const AddNewListingForm = () => {
  return ()
}


export default ReviewApplications
