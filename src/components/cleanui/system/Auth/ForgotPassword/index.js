import React from 'react'
import { Input, Button, Form, notification } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import * as jwt from 'services/jwt'

const ForgotPassword = () => {
  const history = useHistory()

  const requestResetPassword = async email => {
    const response = await jwt.forgetPassword(email)
    if (response) {
      if (response.success && response.message) {
        notification.success({
          message: response.message,
        })
      }
      history.push('/auth/login')
    }
  }

  const onRequestReset = values => {
    requestResetPassword(values.email)
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
                layout="vertical"
                hideRequiredMark
                onFinish={onRequestReset}
                onFinishFailed={onFinishFailed}
                className="mb-4"
              >
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your e-mail address' }]}
                >
                  <Input size="large" placeholder="Email Address" />
                </Form.Item>
                <Button type="primary" htmlType="submit" size="large" className="text-center w-100">
                  <strong>Reset my password</strong>
                </Button>
              </Form>
              <Link to="/auth/login" className="kit__utils__link font-size-16">
                <i className="fe fe-arrow-left mr-1 align-middle" />
                Go to Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
