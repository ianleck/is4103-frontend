import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Descriptions, Form, Input, Modal } from 'antd'
import style from './style.module.scss'

const mapStateToProps = ({ user }) => ({
  userData: {
    firstName: user.firstName ? user.firstName : '',
    lastName: user.lastName ? user.lastName : '',
    username: user.username ? user.username : '',
    emailVerified: user.emailVerified ? user.emailVerified : false,
    email: user.email ? user.email : '',
    contactNumber: user.contactNumber ? user.contactNumber : '',
    status: user.status,
    userTypeEnum: user.userTypeEnum,
  },
})

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo)
}

const EditProfileForm = ({ userData }) => {
  if (userData.userTypeEnum === 'STUDENT') {
    return (
      <Form
        layout="vertical"
        hideRequiredMark
        onFinish={() => console.log('success')}
        onFinishFailed={onFinishFailed}
        initialValues={{
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          email: userData.email,
          contactNumber: userData.contactNumber,
        }}
      >
        <div className="row">
          <div className="col-6">
            <Form.Item name="username" label="Username">
              <Input disabled />
            </Form.Item>
          </div>
          <div className="col-6">
            <Form.Item name="email" label="Email">
              <Input disabled />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please input your First Name' }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please input your Last Name' }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="col-12">
            <Form.Item name="contactNumber" label="Contact Number">
              <Input />
            </Form.Item>
          </div>
        </div>
      </Form>
    )
  }
  return <span>Bye</span>
}

const ProfileCard = ({ userData }) => {
  const [showEditProfile, setShowEditProfile] = useState(false)

  return (
    <div className="row justify-content-start">
      <div className="col-auto">
        <div className="kit__utils__avatar kit__utils__avatar--size64 mb-3">
          <img src="../resources/images/avatars/5.jpg" alt="Mary Stanform" />
        </div>
      </div>
      <div className="col-auto">
        <div className="text-dark font-weight-bold font-size-18">{`${userData.firstName} ${userData.lastName}`}</div>
        <div className="text-uppercase font-size-12 mb-3">{userData.userTypeEnum}</div>
      </div>
      <div className="col-12 text-left mt-2">
        <Descriptions
          title="Information"
          bordered
          size="small"
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          extra={
            <div>
              <button
                type="button"
                className={`btn btn-primary ${style.btnWithAddon}`}
                onClick={() => setShowEditProfile(true)}
              >
                <span className={`${style.btnAddon}`}>
                  <i className={`${style.btnAddonIcon} fe fe-edit`} />
                </span>
                Edit
              </button>
              <button type="button" className="btn btn-outline-primary ml-2">
                <span className={`${style.btnAddon}`}>
                  <i className={`${style.btnAddonIcon} fe fe-share-2`} />
                </span>
              </button>
            </div>
          }
        >
          <Descriptions.Item label="Username">{userData.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
          <Descriptions.Item label="Contact Number">{userData.contactNumber}</Descriptions.Item>
        </Descriptions>
      </div>
      <Modal
        title="Edit Profile"
        visible={showEditProfile}
        okText="Save"
        onOk={() => setShowEditProfile(false)}
        onCancel={() => setShowEditProfile(false)}
      >
        <EditProfileForm userData={userData} />
      </Modal>
    </div>
  )
}

export default connect(mapStateToProps)(ProfileCard)
