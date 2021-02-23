import React from 'react'
import { useParams } from 'react-router-dom'
import { Button, Descriptions } from 'antd'
import { CheckOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons'

const MentorProfile = () => {
  const { mentorId } = useParams()

  return (
    <div className="row">
      <div className="col-xl-8 col-lg-12">
        <div className="card">
          <div className="card-body">
            <Descriptions title="Mentor's Information" bordered column={2}>
              <Descriptions.Item label="Account ID">{mentorId}</Descriptions.Item>
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

        <div className="card-body" style={{ float: 'right' }}>
          <Button type="primary" shape="round" icon={<CheckOutlined />}>
            Accept Sensei
          </Button>
          <Button danger shape="round" icon={<CloseOutlined />}>
            Reject Sensei
          </Button>
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
              src="../resources/images/avatars/administrator.png"
              alt="Mary Stanform"
            />
          </div>
        </div>

        <div className="card">
          <Button type="primary" shape="round" icon={<DownloadOutlined />}>
            Transcript
          </Button>
          <br />
          <Button type="primary" shape="round" icon={<DownloadOutlined />}>
            Personal Writeup
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MentorProfile
