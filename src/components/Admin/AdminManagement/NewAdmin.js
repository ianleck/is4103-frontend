import React from 'react'
import { useHistory } from 'react-router-dom'
import Fade from 'reactstrap/lib/Fade'
import { Button, Input, Form } from 'antd'

const NewAdmin = () => {
  const handleCancel = e => {
    e.preventDefault()
    const path = '/admin/admin-management/'
    history.push(path)
  }
  const history = useHistory()

  const onFinish = values => {
    console.log(values)
  }

  const onFinishFailed = () => {
    console.log('Failed')
  }

  const NewAdminForm = () => {
    return (
      <div className="card">
        <div className="card-body">
          <h4>Input Admin Details: </h4>
          <br />
          <Fade>
            <Form
              layout="vertical"
              hideRequiredMark
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={{
                permissions: 'admin',
              }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input username' }]}
              >
                <Input placeholder="Username" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input password' }]}
              >
                <Input placeholder="Password" type="password" />
              </Form.Item>

              <Form.Item
                name="firstname"
                rules={[{ required: true, message: 'Please input First Name' }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>

              <Form.Item
                name="lastname"
                rules={[{ required: true, message: 'Please input Last Name' }]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input e-mail address' }]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="contact"
                rules={[{ required: true, message: 'Please input Contact Number' }]}
              >
                <Input placeholder="Contact Number" />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Create New Admin
              </Button>
              <Button type="danger" onClick={handleCancel}>
                Cancel
              </Button>
            </Form>
          </Fade>
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
