import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Descriptions, Modal } from 'antd'
import { EditOutlined } from '@ant-design/icons'

const MyAdminProfile = () => {
  // const accessToken = useSelector(state => state.accessToken)
  const user = useSelector(state => state.user)
  const [showEditInformation, setShowEditInformation] = useState(false)
  console.log(user)

  const saveFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <button
          type="button"
          onClick={() => setShowEditInformation(false)}
          className="btn btn-outline-default"
        >
          Close
        </button>
      </div>
      <div className="col-auto">
        <Button
          type="primary"
          form="updatePersonalInformationForm"
          htmlType="submit"
          size="large"
          className=""
        >
          Submit
        </Button>
      </div>
    </div>
  )

  const convertDateFromSystem = date => {
    return date.substring(0, 10)
  }

  return (
    <div className="row">
      <div className="col-xl-8 col-lg-12">
        <div className="card">
          <div className="card-body">
            <Descriptions title="User's Information" bordered column={2}>
              <Descriptions.Item label="Account ID">
                {user.accountId ? user.accountId : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Username">
                {user.username ? user.username : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="First Name">
                {user.firstName ? user.firstName : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Last Name">
                {user.lastName ? user.lastName : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Paypal ID">
                {user.paypalId ? user.paypalId : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="CreatedAt">
                {user.createdAt ? convertDateFromSystem(user.createdAt) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{user.email ? user.email : '-'}</Descriptions.Item>
              <Descriptions.Item label="Email Verified">
                {user.emailVerified ? 'TRUE' : 'FALSE'}
              </Descriptions.Item>
              <Descriptions.Item label="Admin Verified">
                {user.adminVerified ? 'TRUE' : 'FALSE'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {user.status ? user.status : '-'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-lg-12">
        <div className="card">
          <div className="card-body">
            <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user.username}
            </h4>
            <img
              style={{ width: '100%' }}
              src="/resources/images/avatars/administrator.png"
              alt="https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown_1-512.png"
            />
          </div>
        </div>

        <div className="card">
          <Button
            type="primary"
            shape="round"
            icon={<EditOutlined />}
            onClick={() => setShowEditInformation(true)}
          >
            Edit Account
          </Button>
          <br />
          <Button type="primary" shape="round" icon={<EditOutlined />}>
            Change Password
          </Button>
        </div>
      </div>

      <div className="col-xl-4 col-lg-12">
        <Modal
          title="Edit Information"
          visible={showEditInformation}
          cancelText="Close"
          centered
          okButtonProps={{ style: { display: 'none' } }}
          onCancel={() => setShowEditInformation(false)}
          footer={saveFormFooter}
        >
          Hi
        </Modal>
      </div>
    </div>
  )
}

export default MyAdminProfile
