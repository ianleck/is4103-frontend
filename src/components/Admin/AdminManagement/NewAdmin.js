import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as jwtAdmin from 'services/jwt/admin'
import { Button, Input, Form, notification } from 'antd'

const NewAdmin = () => {
  const user = useSelector(state => state.user)

  useEffect(() => {
    checkSuperAdmin()
  }, [])

  const checkSuperAdmin = () => {
    // console.log(user)
    if (user.permission !== 'SUPERADMIN') {
      const path = '/admin'
      history.push(path)
    }
  }

  const handleCancel = e => {
    e.preventDefault()
    const path = '/admin/admin-management/'
    history.push(path)
  }
  const history = useHistory()

  // const sleep = milliseconds => {
  //   return new Promise(resolve => setTimeout(resolve, milliseconds))
  // }

  const onFinish = async values => {
    // console.log('Values', values)
    if (values.password === values.confirmPassword) {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }

      const response1 = await jwtAdmin.createAdmin(payload)
      // console.log('response1', response1)

      if (response1) {
        notification.success({
          message: 'Success',
          description: 'New Admin Account created',
        })
        const path = '/admin/admin-management'
        history.push(path)
      }

      // if (response1 !== false) {
      //   // sleep(2000)
      //   values.accountId = response1.user.accountId
      //   console.log('values Account Id', values.accountId)

      //   const response2 = await jwtAdmin.updateAdminProfile(
      //     values.accountId,
      //     values.firstName,
      //     values.lastName,
      //     values.contactNumber,
      //   )
      //   console.log('response2', response2)

      //   if (response2) {
      //     // sleep(1000)
      //     const response3 = await jwtAdmin.updatePermission(values.accountId, values.permission)
      //     console.log('response3', response3)
      //   }
      // }
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
          <h4>Input Admin Details: </h4>
          <br />

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
              name="confirmPassword"
              rules={[{ required: true, message: 'Please re-enter password' }]}
            >
              <Input placeholder="Re-enter Password" type="password" />
            </Form.Item>

            {/* <Form.Item
                name="firstName"
                rules={[{ required: true, message: 'Please input First Name' }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>

              <Form.Item
                name="lastName"
                rules={[{ required: true, message: 'Please input Last Name' }]}
              >
                <Input placeholder="Last Name" />
              </Form.Item> */}

            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input e-mail address' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            {/* <Form.Item
                name="contactNumber"
                rules={[{ required: true, message: 'Please input Contact Number' }]}
              >
                <Input placeholder="Contact Number" type="number" />
              </Form.Item>

              <Form.Item
                name="permission"
                rules={[{ required: true, message: 'Please select Admin Permission' }]}
              >
                <Select placeholder="Select Admin Permission">
                  <Option value="ADMIN">ADMIN</Option>
                  <Option value="SUPERADMIN">SUPERADMIN</Option>
                </Select>
              </Form.Item> */}

            <Button type="primary" htmlType="submit">
              Create New Admin
            </Button>
            <Button type="danger" onClick={handleCancel}>
              Cancel
            </Button>
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
