import { Button, Divider, Form, Input, Popconfirm, Select, Switch } from 'antd'
import { LockOutlined, RedoOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import FadeIn from 'react-fade-in'
import { PRIVACY_PERMISSIONS_ENUM } from 'constants/constants'

const StudentSettings = () => {
  const { Option, OptGroup } = Select

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const isLoading = user.loading
  const isPrivateUser = user.privacy === PRIVACY_PERMISSIONS_ENUM.FOLLOWING_ONLY
  const isInAppNotifOn = false
  const isEmailNotifOn = false
  const [activeTab, setActiveTab] = useState('privacy')
  const [isConfirmDelete, setIsConfirmDelete] = useState(false)
  const [togglePrivacy, setTogglePrivacy] = useState(isPrivateUser)
  const [toggleInAppNotif, setToggleInAppNotif] = useState(isInAppNotifOn)
  const [toggleEmailNotif, setToggleEmailNotif] = useState(isEmailNotifOn)

  const changeActiveTab = tabKey => {
    setActiveTab(tabKey)
  }

  const showPopconfirm = () => {
    setIsConfirmDelete(true)
  }

  const handleCancel = () => {
    setIsConfirmDelete(false)
  }

  const formItemLayout = { labelCol: { span: 12 }, wrapperCol: { span: 12 } }

  const onChangePassword = values => {
    dispatch({
      type: 'user/CHANGE_PASSWORD',
      payload: {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
    })
  }

  const onConfirmDelete = () => {
    dispatch({
      type: 'user/DELETE_ACCOUNT',
      payload: {
        accountId: user.accountId,
      },
    })
  }

  const onChangePrivacy = () => {
    setTogglePrivacy(!togglePrivacy)
  }

  const onChangeInAppNotif = () => {
    setToggleInAppNotif(!toggleInAppNotif)
  }

  const onChangeEmailNotif = () => {
    setToggleEmailNotif(!toggleEmailNotif)
  }

  const PrivateProfileToggleMsg = () => {
    if (togglePrivacy)
      return (
        <small>
          You are currently using a <strong>Private</strong> Profile. Only approved followers will
          be able to see your profile.
        </small>
      )
    return (
      <small>
        You are currently using a <strong>Public</strong> Profile. Anyone will be able to see your
        profile and follow you without approval.
      </small>
    )
  }

  const HasInAppNotifMsg = () => {
    if (toggleInAppNotif)
      return <small>You will receive notifications in your Digi Dojo notification drawer.</small>
    return (
      <small>
        You will <strong>not</strong> receive notifications in your Digi Dojo notification drawer.
      </small>
    )
  }

  const HasEmailNotifMsg = () => {
    if (toggleEmailNotif) return <small>You will receive notifications via email.</small>
    return (
      <small>
        You will <strong>not</strong> receive notifications via email.
      </small>
    )
  }

  const SecurityCard = () => {
    return (
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-auto">
              <h4 className="text-dark font-weight-bold">Security</h4>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12">
              <span className="h6 text-dark font-weight-bold">Change Password</span>
              <hr />
              <Form
                {...formItemLayout}
                hideRequiredMark
                name="changePasswordForm"
                layout="vertical"
                onFinish={onChangePassword}
              >
                <Form.Item
                  name="oldPassword"
                  label="Old password"
                  rules={[{ required: true, message: 'Please input your old password.' }]}
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder=""
                  />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="New password"
                  rules={[{ required: true, message: 'Please input your new password.' }]}
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder=""
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm new password"
                  rules={[{ required: true, message: 'Please input your new password again.' }]}
                >
                  <Input
                    prefix={<RedoOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder=""
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" loading={isLoading} htmlType="submit">
                    Update password
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className="col-12 mt-4">
              <span className="h6 text-dark font-weight-bold">Delete Account</span>
              <hr />
              <ConfirmDeleteButton />
              <div className="mt-2">
                <small className="text-dark">
                  Once you delete your account, there is no going back. Please be certain.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const ConfirmDeleteButton = () => {
    return (
      <Popconfirm
        title="Do you wish to delete your account?"
        visible={isConfirmDelete}
        onConfirm={onConfirmDelete}
        okText="Delete"
        okType="danger"
        okButtonProps={{ loading: isLoading }}
        onCancel={handleCancel}
      >
        <Button type="danger" onClick={showPopconfirm}>
          Delete your account
        </Button>
      </Popconfirm>
    )
  }

  const PrivacyCard = () => {
    return (
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-auto">
              <h4 className="text-dark font-weight-bold">Privacy</h4>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12">
              <span className="h6 text-dark font-weight-bold">Profile Privacy</span>
              <hr />
              <Switch checked={togglePrivacy} onChange={onChangePrivacy} />
              <span>&nbsp;&nbsp;Private Profile</span>
              <div className="mt-2">
                <PrivateProfileToggleMsg />
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12 mt-4">
              <span className="h6 text-dark font-weight-bold">Toggle Message Privileges</span>
              <hr />
              <Select defaultValue="1" style={{ width: 200 }} onChange={() => console.log('shiok')}>
                <OptGroup label="Social">
                  <Option value="1">Everyone</Option>
                  <Option value="2">Only people I am following</Option>
                </OptGroup>
                <OptGroup label="Anti-social">
                  <Option value="3">No one</Option>
                </OptGroup>
              </Select>
              <div className="mt-2">
                <small>You can receive messages from everyone.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const NotificationsCard = () => {
    return (
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-auto">
              <h4 className="text-dark font-weight-bold">Notifications</h4>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12">
              <span className="h6 text-dark font-weight-bold">Delivery Methods</span>
              <hr />
              <div>
                <Switch checked={toggleInAppNotif} onChange={onChangeInAppNotif} />
                <span>&nbsp;&nbsp;In-app Notifications</span>
                <div className="mt-2">
                  <HasInAppNotifMsg />
                </div>
              </div>
              <div className="mt-4">
                <Switch checked={toggleEmailNotif} onChange={onChangeEmailNotif} />
                <span>&nbsp;&nbsp;Email Notifications</span>
                <div className="mt-2">
                  <HasEmailNotifMsg />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Helmet title="Account Settings" />
      <div className="row">
        <div className="col-12 col-md-3">
          <span className="text-dark h4 font-weight-bold">Account Settings</span>
          <Divider />
          <Button
            block
            type={`${activeTab === 'security' ? 'primary' : 'default'}`}
            onClick={() => changeActiveTab('security')}
          >
            Security
          </Button>
          <Button
            block
            type={`${activeTab === 'privacy' ? 'primary' : 'default'}`}
            onClick={() => changeActiveTab('privacy')}
            className="mt-2"
          >
            Privacy
          </Button>
          <Button
            block
            type={`${activeTab === 'notifications' ? 'primary' : 'default'}`}
            onClick={() => changeActiveTab('notifications')}
            className="mt-2"
          >
            Notifications
          </Button>
        </div>

        <div className="col-12 col-md-9 mt-4 mt-md-0">
          <FadeIn key="1">
            {activeTab === 'security' && <SecurityCard />}
            {activeTab === 'privacy' && <PrivacyCard />}
            {activeTab === 'notifications' && <NotificationsCard />}
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

export default StudentSettings
