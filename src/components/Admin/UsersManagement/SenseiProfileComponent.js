import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import * as jwtAdmin from 'services/jwt/admin'
import { Button, Descriptions, Table, Tabs } from 'antd'
import { StopOutlined, ArrowLeftOutlined } from '@ant-design/icons'

const { TabPane } = Tabs
const { Column } = Table

const SenseiProfileComponent = () => {
  const { userId } = useParams()
  const history = useHistory()
  const [sensei, setSensei] = useState({
    accountId: '',
    adminVerified: '',
    bio: '',
    contactNumber: null,
    createdAt: '',
    deletedAt: null,
    email: '',
    emailVerified: false,
    firstName: null,
    headline: null,
    industry: null,
    lastName: null,
    occupation: null,
    paypalId: null,
    personality: null,
    privacy: '',
    status: '',
    updatedAt: '',
    userType: '',
    username: '',
  })
  const [mentorshipListings, setMentorshipListings] = useState()

  const [tabKey, setTabKey] = useState('1')
  const changeTab = key => {
    setTabKey(key)
  }

  useEffect(() => {
    getSensei()
    getListings()
  }, [])

  const getSensei = async () => {
    const response = await jwtAdmin.getSensei(userId)
    // console.log(response)
    setSensei(response)
  }

  const getListings = async () => {
    const response = await jwtAdmin.getMentorMentorshipListings(userId)
    // console.log('Listings response', response)
    setMentorshipListings(response)
  }

  const convertDateFromSystem = date => {
    return date.substring(0, 10)
  }

  const onBack = e => {
    e.preventDefault()
    const path = '/admin/user-management/'
    history.push(path)
  }

  const showMentorshipListings = () => {
    return (
      <Table bordered="true" dataSource={mentorshipListings} rowKey="accountId">
        <Column
          title="Mentorship Listing Id"
          dataIndex="mentorshipListingId"
          key="mentorshipListingId"
        />
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Rating" dataIndex="rating" key="rating" />
        <Column title="Created At" dataIndex="createdAt" key="createdAt" />
        <Column title="Updated At" dataIndex="updatedAt" key="updatedAt" />
        <Column title="Deleted At" dataIndex="deletedAt" key="deletedAt" />
      </Table>
    )
  }

  return (
    <div className="row">
      <div className="col-xl-12 col-lg-12">
        <div className="col-xl-2 col-lg-12">
          <div className="card">
            <Button type="primary" shape="round" onClick={onBack} icon={<ArrowLeftOutlined />}>
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="col-xl-8 col-lg-12">
        <div className="card">
          <div className="card-body">
            <Descriptions title="Sensei's Information" bordered column={2}>
              <Descriptions.Item label="Account ID">
                {sensei.accountId ? sensei.accountId : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Username">
                {sensei.username ? sensei.username : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="First Name">
                {sensei.firstName ? sensei.firstName : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Last Name">
                {sensei.lastName ? sensei.lastName : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Headline">
                {sensei.headline ? sensei.headline : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Bio">{sensei.bio ? sensei.bio : '-'}</Descriptions.Item>
              <Descriptions.Item label="Industry">
                {sensei.industry ? sensei.industry : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Occupation">
                {sensei.occupation ? sensei.occupation : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Personality">
                {sensei.personality ? sensei.personality : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Privacy">
                {sensei.privacy ? sensei.privacy : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="User Type">
                {sensei.userType ? sensei.userType : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Paypal ID">
                {sensei.paypalId ? sensei.paypalId : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="CreatedAt">
                {sensei.createdAt ? convertDateFromSystem(sensei.createdAt) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {sensei.email ? sensei.email : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Email Verified">
                {sensei.emailVerified ? sensei.emailVerified : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Admin Verified">
                {sensei.adminVerified ? sensei.adminVerified : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {sensei.status ? sensei.status : '-'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-lg-12">
        <div className="card">
          <div className="card-body">
            <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {sensei.firstName ? sensei.firstName : 'Anonymous'}{' '}
              {sensei.lastName ? sensei.lastName : 'Sensei'}
            </h4>
            <img
              style={{ width: '100%' }}
              src="/resources/images/avatars/sensei.png"
              alt="https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown_1-512.png"
            />
          </div>
        </div>

        <div className="card">
          <Button danger shape="round" icon={<StopOutlined />}>
            Ban Account
          </Button>
        </div>
      </div>

      <div className="col-xl-12 col-lg-12">
        <div className="card">
          <div className="card-header card-header-flex">
            <div className="d-flex flex-column justify-content-center mr-auto">
              <h5>Mentorship Listings</h5>
            </div>
            <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
              <TabPane tab="Mentorship Listings" key="1" />
            </Tabs>
          </div>

          <div className="card-body">{tabKey === '1' && showMentorshipListings()}</div>
        </div>
      </div>
    </div>
  )
}

export default SenseiProfileComponent
