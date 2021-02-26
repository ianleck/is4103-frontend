import { Button, Divider, Form, Input } from 'antd'
import { LockOutlined, RedoOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import FadeIn from 'react-fade-in'

const StudentSettings = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('security')

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

  const changeActiveTab = tabKey => {
    setActiveTab(tabKey)
  }

  const formItemLayout = { labelCol: { span: 12 }, wrapperCol: { span: 12 } }

  const SecurityCard = () => {
    return (
      <FadeIn>
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
                  initialValues={{ remember: true }}
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
                    <Button type="primary" htmlType="submit">
                      Update password
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div className="col-12 mt-4">
                <span className="h6 text-dark font-weight-bold">Delete Account</span>
                <hr />
                <Button type="danger">Delete your account</Button>
                <div className="mt-2">
                  <small className="text-dark">
                    Once you delete your account, there is no going back. Please be certain.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    )
  }

  const PrivacyCard = () => {
    return <span>Hi</span>
  }
  const NotificationsCard = () => {
    return <span>Hi</span>
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
          {activeTab === 'security' && <SecurityCard />}
          {activeTab === 'privacy' && <PrivacyCard />}
          {activeTab === 'notifications' && <NotificationsCard />}
        </div>
      </div>
    </div>
  )
}

export default StudentSettings
