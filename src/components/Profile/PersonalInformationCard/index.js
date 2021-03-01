import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Descriptions, Form, Input, Modal, Typography } from 'antd'
import QRCode from 'react-qr-code'
import { isNil } from 'lodash'
import { FacebookShareButton, FacebookIcon, LinkedinShareButton, LinkedinIcon } from 'react-share'
import { USER_TYPE_ENUM } from 'constants/constants'
import { QrcodeOutlined } from '@ant-design/icons'

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo)
}

const PersonalInformationCard = () => {
  const { Paragraph } = Typography

  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [showEditInformation, setShowEditInformation] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  const shareUrl = `http://digi.dojo/profile/${user.accountId}`
  const title = `${user.firstName} is sharing his Digi Dojo profile with you!`

  const onUpdateProfile = values => {
    values.accountId = user.accountId
    values.isStudent = user.userType === USER_TYPE_ENUM.STUDENT
    dispatch({
      type: 'user/UPDATE_PERSONAL_INFO',
      payload: values,
    })
    setShowEditInformation(false)
  }

  const saveFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button
          ghost
          type="primary"
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

  return (
    <div className="card">
      <div className="card-body">
        <div className="row justify-content-between">
          <div className="col-auto">
            <div className="kit__utils__avatar kit__utils__avatar--size64 mb-3">
              <img src="../resources/images/avatars/5.jpg" alt="Mary Stanform" />
            </div>
          </div>
          <div className="col-auto d-flex justify-content-center mt-2">
            <Button
              type="primary"
              shape="round"
              icon={<QrcodeOutlined />}
              size="middle"
              onClick={() => setShowQRCode(true)}
            />
            <div>
              <FacebookShareButton className="ml-3" url={shareUrl} quote={title} hashtag="DigiDojo">
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <LinkedinShareButton url={shareUrl} className="ml-2">
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
            </div>
          </div>
          <div className="col-12">
            <div
              className={`${
                isNil(user.firstName) || isNil(user.lastName) ? 'text-danger' : 'text-dark'
              } h3 font-weight-bold`}
            >
              {`${isNil(user.firstName) ? 'Anonymous' : user.firstName} ${
                isNil(user.lastName) ? 'Pigeon' : user.lastName
              }`}{' '}
              {(isNil(user.firstName) || isNil(user.lastName)) && <small>*Update required</small>}
            </div>
          </div>
          <div className="col-12">
            <div className="h5 text-dark text-uppercase">{user.userType}</div>
          </div>
          <div className="col-12 text-left mt-2">
            <Descriptions
              title="Personal Information"
              bordered
              size="small"
              column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
              extra={
                <Button
                  ghost
                  type="primary"
                  shape="round"
                  icon={<i className="fe fe-edit-3" />}
                  size="large"
                  onClick={() => setShowEditInformation(true)}
                >
                  &nbsp;&nbsp;Edit
                </Button>
              }
            >
              <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
              <Descriptions.Item label="Email">
                {user.email}
                {!user.emailVerified && <VerifyEmailLink />}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Number">{user.contactNumber}</Descriptions.Item>
            </Descriptions>
          </div>
          <Modal
            title="Edit Information"
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
                <div className="col-12">
                  <Form.Item
                    name="contactNumber"
                    label="Contact Number"
                    rules={[{ required: true, message: 'Please input a valid Contact Number' }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Modal>
          <Modal
            title="View QR"
            visible={showQRCode}
            cancelText="Close"
            centered
            okButtonProps={{ style: { display: 'none' } }}
            onCancel={() => setShowQRCode(false)}
          >
            <div className="row mt-3">
              <div className="col-12 text-center">
                <QRCode value={`http://localhost:3000/profile/${user.accountId}`} />
                <div className="mt-3">
                  <Paragraph copyable={{ text: `http://localhost:3000/profile/${user.accountId}` }}>
                    Share Link
                  </Paragraph>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  )
}

const VerifyEmailLink = () => {
  return (
    <div>
      <a href="#" className="btn-link">
        Verify Email
      </a>
    </div>
  )
}

export default PersonalInformationCard
