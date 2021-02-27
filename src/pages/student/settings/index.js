import { Button, Divider, Form, Input, Popconfirm } from 'antd'
import { LockOutlined, RedoOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import FadeIn from 'react-fade-in'

const StudentSettings = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const isLoading = user.loading
  const [activeTab, setActiveTab] = useState('security')
  const [isConfirmDelete, setIsConfirmDelete] = useState(false)

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
      <FadeIn>
        <span>Hi</span>
      </FadeIn>
    )
  }
  const NotificationsCard = () => {
    return (
      <FadeIn>
        <span>Hi</span>
      </FadeIn>
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
