import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Descriptions, Modal, Form, Input, notification } from 'antd'
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import moment from 'moment'

const MyAdminProfile = () => {
  // const accessToken = useSelector(state => state.accessToken)
  const user = useSelector(state => state.user)
  const [showEditInformation, setShowEditInformation] = useState(false)
  const [showChangePassword, setshowChangePassword] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  const onBack = e => {
    e.preventDefault()
    const path = '/admin/admin-management/'
    history.push(path)
  }

  const saveFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button
          type="default"
          size="large"
          onClick={() => setShowEditInformation(false)}
          className=""
        >
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button
          type="primary"
          form="updatePersonalInformationForm"
          htmlType="submit"
          size="large"
          className=""
        >
          Submit
        </Button>
      </div>
    </div>
  )

  const passwordFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button
          type="default"
          size="large"
          onClick={() => setshowChangePassword(false)}
          className=""
        >
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button
          type="primary"
          form="updatePasswordForm"
          htmlType="submit"
          size="large"
          className=""
        >
          Change Password
        </Button>
      </div>
    </div>
  )

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const onUpdateProfile = values => {
    values.accountId = user.accountId
    dispatch({
      type: 'admin/UPDATE_PROFILE',
      payload: values,
    })
    setShowEditInformation(false)
  }

  const onChangePassword = values => {
    values.accountId = user.accountId

    if (values.newPassword === values.confirmPassword) {
      dispatch({
        type: 'admin/CHANGE_PASSWORD',
        payload: values,
      })
      setshowChangePassword(false)
    } else {
      notification.warn({
        message: 'Passwords do not match',
        description: 'Please ensure both passwords entered match',
      })
    }
  }

  return (
    <div>
      <div className="row mt-4">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <Button
            block
            type="primary"
            size="large"
            shape="round"
            onClick={onBack}
            icon={<ArrowLeftOutlined />}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-xl-8 col-lg-12">
          <div className="card">
            <div className="card-body">
              <Descriptions title="Admin's Information" bordered column={2}>
                <Descriptions.Item label="Account ID">
                  {user.accountId ? user.accountId : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Username">
                  {user.username ? user.username : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="First Name">
                  {user.firstName ? user.firstName : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Last Name">
                  {user.lastName ? user.lastName : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {user.createdAt ? moment(user.createdAt).format('YYYY-MM-DD h:mm:ss a') : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Deleted At">
                  {user.deletedAt ? moment(user.deletedAt).format('YYYY-MM-DD h:mm:ss a') : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Contact Number">
                  {user.contactNumber ? user.contactNumber : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">{user.email ? user.email : '-'}</Descriptions.Item>
                <Descriptions.Item label="Email Verified">
                  {user.emailVerified ? 'TRUE' : 'FALSE'}
                </Descriptions.Item>
                <Descriptions.Item label="Admin Permission">
                  {user.role ? user.role : '-'}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.username}
              </h4>
              <img
                style={{ width: '100%' }}
                src="/resources/images/avatars/administrator.png"
                alt="https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown_1-512.png"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <Button
                block
                type="primary"
                size="large"
                shape="round"
                icon={<EditOutlined />}
                onClick={() => setShowEditInformation(true)}
              >
                Edit Account
              </Button>
            </div>
            <div className="col-12 mt-4">
              <Button
                block
                type="primary"
                size="large"
                shape="round"
                icon={<EditOutlined />}
                onClick={() => setshowChangePassword(true)}
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <Modal
            title="Edit Account"
            visible={showEditInformation}
            cancelText="Close"
            centered
            okButtonProps={{ style: { display: 'none' } }}
            onCancel={() => setShowEditInformation(false)}
            footer={saveFormFooter}
          >
            <Form
              id="updatePersonalInformationForm"
              layout="vertical"
              hideRequiredMark
              onFinish={onUpdateProfile}
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
                <div className="col-md-6">
                  <Form.Item
                    name="contactNumber"
                    label="Contact Number"
                    rules={[{ required: true, message: 'Please input your ContactNumber' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Modal>
        </div>

        <div className="col-xl-4 col-lg-12">
          <Modal
            title="Change My Password"
            visible={showChangePassword}
            cancelText="Close"
            centered
            okButtonProps={{ style: { display: 'none' } }}
            onCancel={() => setshowChangePassword(false)}
            footer={passwordFormFooter}
          >
            <Form
              id="updatePasswordForm"
              layout="vertical"
              hideRequiredMark
              onFinish={onChangePassword}
              onFinishFailed={onFinishFailed}
              initialValues={{
                newPassword: '',
                confirmPassword: '',
                username: user.username,
                email: user.email,
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
                    name="newPassword"
                    label="Password"
                    rules={[{ required: true, message: 'Please input your Password' }]}
                  >
                    <Input type="password" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    name="confirmPassword"
                    label="Re-enter your password"
                    rules={[{ required: true, message: 'Please confirm your Password' }]}
                  >
                    <Input type="password" />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default MyAdminProfile
