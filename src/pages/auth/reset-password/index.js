import React from 'react'
import { Button, Form, Input, notification } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import * as jwt from 'services/jwt'

const ResetPasswordPage = () => {
  const history = useHistory()
  const useQuery = () => new URLSearchParams(useLocation().search)
  const user = useSelector(state => state.user)
  const resetToken = useQuery().get('token')
  const accountId = useQuery().get('id')

  const onResetPassword = async values => {
    const response = await jwt.resetPassword(resetToken, accountId, values.newPassword)
    if (response) {
      if (response.success && response.message) {
        notification.success({
          message: response.message,
        })
      }
      history.push('/auth/login')
    }
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <div className="card">
            <div className="card-body p-5">
              <div className="text-dark font-size-24 mb-4">
                <strong>Reset Password</strong>
              </div>
              <Form
                hideRequiredMark
                name="changePasswordForm"
                layout="vertical"
                onFinish={onResetPassword}
                onFinishFailed={onFinishFailed}
              >
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
                <Form.Item>
                  <Button type="primary" loading={user.loading} htmlType="submit">
                    Reset password
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
