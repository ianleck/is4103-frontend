import React from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Button, Image, Descriptions } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

const MentorPage = () => {
  const { mentorId } = useParams()

  return (
    <div>
      <Helmet title="Mentor's Page" />
      <div className="cui__utils__heading">
        <strong>User ID: {mentorId}</strong>
      </div>

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
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Samantha Lee
              </h4>
              <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
            </div>
          </div>

          <div className="card">
            <Button icon={<DownloadOutlined />}>Transcript</Button>

            <Button icon={<DownloadOutlined />}>Personal Writeup</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorPage
