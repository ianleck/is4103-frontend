import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Descriptions, Form, Input, Modal, Typography, Upload, message } from 'antd'
import QRCode from 'react-qr-code'
import { isNil } from 'lodash'
import { FacebookShareButton, FacebookIcon, LinkedinShareButton, LinkedinIcon } from 'react-share'
import { QrcodeOutlined, CameraOutlined, PlusOutlined } from '@ant-design/icons'
import actions from 'redux/user/actions'
import { USER_TYPE_ENUM } from 'constants/constants'
import moment from 'moment'

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo)
}

const PersonalInformationCard = ({ user, showEditTools, isAdmin }) => {
  const { Paragraph } = Typography

  const dispatch = useDispatch()

  const [showEditInformation, setShowEditInformation] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [showDPModal, setShowDPModal] = useState(false)

  const shareUrl = `http://digi.dojo/profile/${user.accountId}`
  const title = `${user.firstName} is sharing his Digi Dojo profile with you!`

  const onUpdateProfile = values => {
    const formValues = {
      accountId: user.accountId,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      contactNumber: values.contactNumber.trim(),
    }
    dispatch({
      type: actions.UPDATE_PROFILE,
      payload: formValues,
    })
    setShowEditInformation(false)
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

  const GetDefaultProfilePic = () => {
    if (user.userType === USER_TYPE_ENUM.STUDENT) {
      return <img src="/resources/images/avatars/apprentice.png" alt="Display Pic" />
    }
    return <img src="/resources/images/avatars/master.png" alt="Display Pic" />
  }

  const getUploadProps = () => {
    return {
      name: 'file',
      action: 'http://localhost:5000/api/upload/dp',
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`)
          dispatch({
            type: 'user/LOAD_CURRENT_ACCOUNT',
          })
          setShowDPModal(false)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      },
      beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!')
        }
        return isJpgOrPng && isLt2M
      },
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="row justify-content-between">
          <div className="col-auto">
            <div className="kit__utils__avatar kit__utils__avatar--size64 mb-3">
              {user.profileImgUrl ? (
                <img src={`${user.profileImgUrl}?${new Date().getTime()}`} alt="Display Pic" />
              ) : (
                GetDefaultProfilePic()
              )}
            </div>
          </div>
          <div className="col-auto d-flex justify-content-center mt-2">
            <Button
              type="primary"
              shape="round"
              size="middle"
              icon={<CameraOutlined />}
              onClick={() => setShowDPModal(true)}
            />
            <Button
              className="ml-2"
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
                !!showEditTools && (
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
                )
              }
            >
              {!!isAdmin && (
                <Descriptions.Item label="Account ID">{user.accountId}</Descriptions.Item>
              )}
              <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
              <Descriptions.Item label="Email">
                {user.email}
                {!user.emailVerified && <VerifyEmailLink />}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Number">{user.contactNumber}</Descriptions.Item>
              {!!isAdmin && (
                <Descriptions.Item label="User Type">{user.userType}</Descriptions.Item>
              )}
              {!!isAdmin && (
                <Descriptions.Item label="Private Profile">
                  {user.isPrivateProfile ? 'Yes' : 'No'}
                </Descriptions.Item>
              )}
              {!!isAdmin && (
                <Descriptions.Item label="Chat Privacy">{user.chatPrivacy}</Descriptions.Item>
              )}
              {!!isAdmin && (
                <Descriptions.Item label="Email Notifications">
                  {user.emailNotification ? 'Yes' : 'No'}
                </Descriptions.Item>
              )}
              {!!isAdmin && (
                <Descriptions.Item label="Paypal ID">{user.paypalId}</Descriptions.Item>
              )}
              {!!isAdmin && (
                <Descriptions.Item label="Created At">
                  {moment(user.createdAt).format('YYYY-MM-DD')}
                </Descriptions.Item>
              )}
              {!!isAdmin && (
                <Descriptions.Item label="Admin Verified">{user.adminVerified}</Descriptions.Item>
              )}
              {!!isAdmin && <Descriptions.Item label="Status">{user.status}</Descriptions.Item>}
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

          <Modal
            title="Upload Display Picture"
            visible={showDPModal}
            cancelText="Close"
            centered
            okButtonProps={{ style: { display: 'none' } }}
            onCancel={() => setShowDPModal(false)}
          >
            <div className="row mt-3">
              <div className="col-12 mt-2 text-center">
                Click on the box below to upload new display picture
              </div>
              <div className="col-12 mt-3 text-center">
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  {...getUploadProps()}
                >
                  {user.profileImgUrl ? (
                    <img
                      src={`${user.profileImgUrl}?${new Date().getTime()}`}
                      alt="avatar"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <div>
                      {' '}
                      <PlusOutlined />
                      Upload
                    </div>
                  )}
                </Upload>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default PersonalInformationCard
