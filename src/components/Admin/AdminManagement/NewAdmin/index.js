import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as jwtAdmin from 'services/jwt/admin'
import { Button, Input, Form, notification } from 'antd'
import { ADMIN_ROLE_ENUM } from 'constants/constants'

const NewAdmin = () => {
  const user = useSelector(state => state.user)
  const history = useHistory()

  useEffect(() => {
    const checkSuperAdmin = () => {
      if (user.role !== ADMIN_ROLE_ENUM.SUPERADMIN) {
        const path = '/admin'
        history.push(path)
      }
    }
    checkSuperAdmin()
  }, [history, user.role])

  const handleCancel = e => {
    e.preventDefault()
    const path = '/admin/admin-management/'
    history.push(path)
  }

  const onFinish = async values => {
    if (values.password.length < 8) {
      notification.warn({
        message: 'Bad Password',
        description: 'Please ensure passwords are more than 8 characters',
      })
    } else if (values.password === values.confirmPassword) {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }

      const response = await jwtAdmin.createAdmin(payload)
      if (response) {
        notification.success({
          message: 'Success',
          description: 'New Admin Account Created',
        })
        const path = '/admin/admin-management'
        history.push(path)
      }
    } else {
      notification.warn({
        message: 'Passwords do not match',
        description: 'Please ensure both passwords entered match',
      })
    }
  }

  const onFinishFailed = () => {
    console.log('Failed')
  }

  const NewAdminForm = () => {
    return (
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <div className="text-dark text-uppercase h3 align-top">
                <strong>
                  <i className="fe fe-shield" />
                  &nbsp;&nbsp;Add New Admin
                </strong>
              </div>
            </div>
          </div>
          <Form
            layout="vertical"
            hideRequiredMark
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              permissions: 'admin',
            }}
          >
            <div className="row mt-4">
              <div className="col-12">
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Please input username' }]}
                >
                  <Input placeholder="Username" />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input password' }]}
                >
                  <Input placeholder="Password" type="password" />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name="confirmPassword"
                  rules={[{ required: true, message: 'Please re-enter password' }]}
                >
                  <Input placeholder="Re-enter Password" type="password" />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input e-mail address' }]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-auto">
                <Button type="primary" size="large" shape="round" htmlType="submit">
                  Create New Admin
                </Button>
              </div>
              <div className="col-auto">
                <Button type="danger" size="large" shape="round" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    )
  }

  return (
    <div className="col-xl-12 col-lg-12">
      <NewAdminForm />
    </div>
  )
}

export default NewAdmin
