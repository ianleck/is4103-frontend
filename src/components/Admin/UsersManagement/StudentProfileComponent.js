import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import * as jwtAdmin from 'services/jwt/admin'
import { Button, Descriptions } from 'antd'
import { StopOutlined, ArrowLeftOutlined } from '@ant-design/icons'

const StudentProfileComponent = () => {
  const { userId } = useParams()
  const history = useHistory()
  const [student, setStudent] = useState({
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

  useEffect(() => {
    getStudent()
  }, [])

  const getStudent = async () => {
    const response = await jwtAdmin.getStudent(userId)
    // console.log(response)
    setStudent(response)
  }

  const convertDateFromSystem = date => {
    return date.substring(0, 10)
  }

  const onBack = e => {
    e.preventDefault()
    const path = '/admin/user-management/'
    history.push(path)
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
            <Descriptions title="Student's Information" bordered column={2}>
              <Descriptions.Item label="Account ID">
                {student.accountId ? student.accountId : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Username">
                {student.username ? student.username : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="First Name">
                {student.firstName ? student.firstName : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Last Name">
                {student.lastName ? student.lastName : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Headline">
                {student.headline ? student.headline : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Bio">{student.bio ? student.bio : '-'}</Descriptions.Item>
              <Descriptions.Item label="Industry">
                {student.industry ? student.industry : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Occupation">
                {student.occupation ? student.occupation : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Personality">
                {student.personality ? student.personality : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Privacy">
                {student.privacy ? student.privacy : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="User Type">
                {student.userType ? student.userType : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Paypal ID">
                {student.paypalId ? student.paypalId : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="CreatedAt">
                {student.createdAt ? convertDateFromSystem(student.createdAt) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {student.email ? student.email : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Email Verified">
                {student.emailVerified ? student.emailVerified : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Admin Verified">
                {student.adminVerified ? student.adminVerified : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {student.status ? student.status : '-'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-lg-12">
        <div className="card">
          <div className="card-body">
            <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {student.firstName ? student.firstName : 'Anonymous'}{' '}
              {student.lastName ? student.lastName : 'Student'}
            </h4>
            <img
              style={{ width: '100%' }}
              src="/resources/images/avatars/graduate.png"
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
    </div>
  )
}

export default StudentProfileComponent
