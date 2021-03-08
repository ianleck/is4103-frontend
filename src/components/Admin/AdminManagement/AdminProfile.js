import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Descriptions, Modal, Form, Input, notification, Select } from 'antd'
import * as jwtAdmin from 'services/jwt/admin'
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { ADMIN_ROLE_ENUM } from 'constants/constants'

const { Option } = Select

const AdminProfile = () => {
  // const accessToken = useSelector(state => state.accessToken)
  const user = useSelector(state => state.user)
  const [showEditInformation, setShowEditInformation] = useState(false)
  const [showChangePassword, setshowChangePassword] = useState(false)
  const history = useHistory()
  const { adminId } = useParams()
  const [admin, setAdmin] = useState('')

  const getAdmin = async () => {
    const response = await jwtAdmin.getAdmin(adminId)
    setAdmin(response)
  }

  useEffect(() => {
    const checkSuperAdminEffect = () => {
      if (user.role !== ADMIN_ROLE_ENUM.SUPERADMIN) {
        const path = '/admin'
        history.push(path)
      }
    }
    const getAdminEffect = async () => {
      const response = await jwtAdmin.getAdmin(adminId)
      setAdmin(response)
    }
    checkSuperAdminEffect()
    getAdminEffect()
  }, [adminId, history, user.role])

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
        <button
          type="button"
          onClick={() => setshowChangePassword(false)}
          className="btn btn-outline-default"
        >
          Cancel
        </button>
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

  const convertDateFromSystem = date => {
    return date.substring(0, 10)
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const onUpdateProfile = async values => {
    values.accountId = admin.accountId
    const response1 = await jwtAdmin.updateAdminProfile(
      values.accountId,
      values.firstName,
      values.lastName,
      values.contactNumber,
    )
    const response2 = await jwtAdmin.updatePermission(values.accountId, values.permission)

    if (response1 && response2) {
      getAdmin()
      notification.success({ message: 'Success', description: 'Admin details changed' })
      setShowEditInformation(false)
    } else if (response1) {
      getAdmin()
      notification.error({ message: 'Warning', description: 'Only Admin names has been changed' })
    } else if (response2) {
      getAdmin()
      notification.error({
        message: 'Warning',
        description: 'Only Admin permission has been changed',
      })
    } else {
      notification.error({ message: 'Error', description: 'Something went wrong...' })
    }
  }

  const onChangePassword = async values => {
    values.accountId = admin.accountId

    if (values.newPassword === values.confirmPassword) {
      const response = await jwtAdmin.updateAdminPassword(
        values.accountId,
        values.newPassword,
        values.confirmPassword,
      )

      if (response.data.success) {
        notification.success({ message: 'Success', description: 'Admin details changed' })
        setshowChangePassword(false)
      } else {
        notification.error({ message: 'Error', description: { response } })
      }
    } else {
      notification.warn({
        message: 'Passwords do not match',
        description: 'Please ensure both passwords entered match',
      })
    }
  }

  const onDelete = async () => {
    // console.log('Account Id', admin.accountId)
    const response = await jwtAdmin.deleteAdmin(admin.accountId)
    // console.log(response)

    if (response) {
      notification.success({ message: 'Success', description: 'Admin Deleted' })
      const path = '/admin/admin-management'
      history.push(path)
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
                  {admin.accountId ? admin.accountId : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Username">
                  {admin.username ? admin.username : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="First Name">
                  {admin.firstName ? admin.firstName : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Last Name">
                  {admin.lastName ? admin.lastName : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {admin.createdAt ? convertDateFromSystem(admin.createdAt) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                  {admin.updatedAt ? convertDateFromSystem(admin.updatedAt) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Deleted At">
                  {admin.deletedAt ? convertDateFromSystem(admin.deletedAt) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Contact Number">
                  {admin.contactNumber ? admin.contactNumber : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {admin.email ? admin.email : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Email Verified">
                  {admin.emailVerified ? 'TRUE' : 'FALSE'}
                </Descriptions.Item>
                <Descriptions.Item label="Admin Permission">
                  {admin.permission ? admin.permission : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {admin.status ? admin.status : '-'}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 mt-4 mt-md-0">
          <div className="card">
            <div className="card-body">
              <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {admin.username}
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
                shape="round"
                size="large"
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

            <div className="col-12 mt-4">
              <Button
                block
                danger
                shape="round"
                size="large"
                icon={<DeleteOutlined />}
                onClick={() => onDelete()}
              >
                Delete Account
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
                firstName: admin.firstName,
                lastName: admin.lastName,
                username: admin.username,
                email: admin.email,
                contactNumber: admin.contactNumber,
                permission: admin.permission,
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
                    rules={[{ required: true, message: 'Please input First Name' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please input Last Name' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    name="contactNumber"
                    label="Contact Number"
                    rules={[{ required: true, message: 'Please input Contact Number' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    name="permission"
                    label="Permissions"
                    rules={[{ required: true, message: 'Please input permissions' }]}
                  >
                    <Select placeholder="Select Admin Permission">
                      <Option value="ADMIN">ADMIN</Option>
                      <Option value="SUPERADMIN">SUPERADMIN</Option>
                    </Select>
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
                username: admin.username,
                email: admin.email,
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

export default AdminProfile
