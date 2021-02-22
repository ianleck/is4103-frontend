import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Descriptions, Form, Input, Modal, Tabs, notification } from 'antd'
import { FacebookShareButton, FacebookIcon, LinkedinShareButton, LinkedinIcon } from 'react-share'
import { isNull } from 'lodash'
import style from './style.module.scss'

const { TabPane } = Tabs

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo)
}

const shareUrl = 'https://github.com'
let title = "I'm sharing my Digi Dojo profile with you!"

const EditProfileForm = () => {
  const user = useSelector(state => state.user)
  if (user.userType === 'STUDENT') {
    title = `${user.firstName} is sharing his Digi Dojo profile with you!`
    return (
      <Form
        layout="vertical"
        hideRequiredMark
        onFinish={() => console.log('success')}
        onFinishFailed={onFinishFailed}
        initialValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          contactNumber: user.contactNumber,
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

const ChangePasswordForm = () => {
  return (
    <Form
      layout="vertical"
      hideRequiredMark
      onFinish={() => console.log('success')}
      onFinishFailed={onFinishFailed}
    >
      <div className="row">
        <div className="col-12">
          <Form.Item name="oldPassword" label="Old Password">
            <Input />
          </Form.Item>
        </div>
        <div className="col-6">
          <Form.Item name="password" label="New Password">
            <Input />
          </Form.Item>
        </div>
        <div className="col-6">
          <Form.Item name="confirmPassword" label="Confirm Password">
            <Input />
          </Form.Item>
        </div>
      </div>
    </Form>
  )
}

const DeleteAccountButton = () => {
  return (
    <div className="row">
      <div className="col-12">
        <button type="button" className="btn btn-danger mb-3">
          Delete Account
        </button>
      </div>
    </div>
  )
}

const ProfileCard = () => {
  const user = useSelector(state => state.user)
  const [showEditInformation, setShowEditInformation] = useState(false)

  const [tabKey, setTabKey] = useState('editProfile')

  const changeTab = key => {
    setTabKey(key)
  }

  const onFinish = () => {
    notification.success({
      message: 'Success',
      description: 'Action successfully completed!',
    })
  }

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
        <button type="button" onClick={onFinish} className="btn btn-primary">
          Save
        </button>
      </div>
    </div>
  )

  return (
    <div className="row justify-content-between">
      <div className="col-auto">
        <div className="kit__utils__avatar kit__utils__avatar--size64 mb-3">
          <img src="../resources/images/avatars/5.jpg" alt="Mary Stanform" />
        </div>
      </div>
      <div className="col">
        <div className="text-dark font-weight-bold font-size-18">
          {`${isNull(user.firstName) ? 'Name' : user.firstName} ${
            isNull(user.lastName) ? '' : user.lastName
          }`}
        </div>
        <div className="text-uppercase font-size-12 mb-3">{user.userType}</div>
      </div>
      <div className="col-auto">
        <FacebookShareButton url={shareUrl} quote={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <LinkedinShareButton url={shareUrl} className="ml-2">
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
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
                onClick={() => setShowEditInformation(true)}
              >
                <span className={`${style.btnAddon}`}>
                  <i className={`${style.btnAddonIcon} fe fe-edit`} />
                </span>
                Edit
              </button>
            </div>
          }
        >
          <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Contact Number">{user.contactNumber}</Descriptions.Item>
        </Descriptions>
      </div>
      <Modal
        title="Edit Information"
        visible={showEditInformation}
        cancelText="Close"
        centered
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowEditInformation(false)}
        bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
        footer={
          (tabKey === 'editProfile' && saveFormFooter) ||
          (tabKey === 'changePassword' && saveFormFooter)
        }
      >
        <Tabs activeKey={tabKey} className="mr-auto kit-tabs-bold" onChange={changeTab}>
          <TabPane tab="Edit Profile" key="editProfile" />
          <TabPane tab="Change Password" key="changePassword" />
          <TabPane tab="Delete Account" key="deleteAccount" />
        </Tabs>
        {tabKey === 'editProfile' && <EditProfileForm user={user} />}
        {tabKey === 'changePassword' && <ChangePasswordForm />}
        {tabKey === 'deleteAccount' && <DeleteAccountButton />}
      </Modal>
    </div>
  )
}

export default ProfileCard
