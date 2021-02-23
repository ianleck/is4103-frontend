import React from 'react'
import { Button, Descriptions } from 'antd'
import { EditOutlined } from '@ant-design/icons'

const MyAdminProfile = () => {
  return (
    <div className="row">
      <div className="col-xl-8 col-lg-12">
        <div className="card">
          <div className="card-body">
            <Descriptions title="User's Information" bordered column={2}>
              <Descriptions.Item label="Account ID">1</Descriptions.Item>
              <Descriptions.Item label="Username">Hello@123</Descriptions.Item>
              <Descriptions.Item label="First Name">Samantha</Descriptions.Item>
              <Descriptions.Item label="Last Name">Lee</Descriptions.Item>
              <Descriptions.Item label="Paypal ID">Ppl123</Descriptions.Item>
              <Descriptions.Item label="CreatedAt">12 July 2020</Descriptions.Item>
              <Descriptions.Item label="Email">Hello@gmail.com</Descriptions.Item>
              <Descriptions.Item label="Email Verified">No</Descriptions.Item>
              <Descriptions.Item label="Admin Verified">No</Descriptions.Item>
              <Descriptions.Item label="Status">Active</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-lg-12">
        <div className="card">
          <div className="card-body">
            <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Samantha Lee
            </h4>
            <img
              style={{ width: '100%' }}
              src="/resources/images/avatars/administrator.png"
              alt="https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown_1-512.png"
            />
          </div>
        </div>

        <div className="card">
          <Button type="primary" shape="round" icon={<EditOutlined />}>
            Edit Account
          </Button>
          <br />
          <Button type="primary" shape="round" icon={<EditOutlined />}>
            Change Password
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MyAdminProfile
