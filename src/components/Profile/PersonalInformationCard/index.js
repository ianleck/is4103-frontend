import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Descriptions, Form, Input, Modal, Upload, message, Tag } from 'antd'
import { isNil } from 'lodash'
import { CameraOutlined, PlusOutlined } from '@ant-design/icons'
import actions from 'redux/user/actions'
import { BACKEND_API, FRONTEND_API, USER_TYPE_ENUM } from 'constants/constants'
import moment from 'moment'
import { NO_DP_TO_REMOVE } from 'constants/notifications'
import ShareBtn from 'components/Common/Social/ShareBtn'
import { getUserFirstName, getUserFullName } from 'components/utils'

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo)
}

const PersonalInformationCard = ({ user, showEditTools, isAdmin }) => {
  const dispatch = useDispatch()

  const [showEditInformation, setShowEditInformation] = useState(false)
  const [showDPModal, setShowDPModal] = useState(false)

  const title = `${getUserFirstName(user)} is sharing their Digi Dojo profile with you!`

  const onUpdateProfile = values => {
    const formValues = {
      accountId: user.accountId,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      contactNumber: !isNil(values.contactNumber) ? values.contactNumber.trim() : null,
    }
    dispatch({
      type: actions.UPDATE_PROFILE,
      payload: formValues,
    })
    setShowEditInformation(false)
  }

  // const VerifyEmailLink = () => {
  //   return (
  //     <div>
  //       <a href="#" className="btn-link">
  //         Verify Email
  //       </a>
  //     </div>
  //   )
  // }

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

  const dpFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setShowDPModal(false)}>
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button danger size="large" onClick={() => removeDP()}>
          Remove Display Picture
        </Button>
      </div>
    </div>
  )

  const removeDP = () => {
    if (!isNil(user.profileImgUrl)) {
      dispatch({
        type: actions.DELETE_DP,
      })
    } else {
      message.warning(NO_DP_TO_REMOVE)
    }
  }

  const getDefaultProfilePic = () => {
    if (user.userType === USER_TYPE_ENUM.STUDENT) {
      return <img src="/resources/images/avatars/apprentice.png" alt="Display Pic" />
    }
    return <img src="/resources/images/avatars/master.png" alt="Display Pic" />
  }

  const getUploadProps = () => {
    return {
      name: 'file',
      action: `${BACKEND_API}/upload/dp`,
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
                getDefaultProfilePic()
              )}
            </div>
          </div>
          <div className="col-auto d-flex justify-content-center mt-2">
            {!isAdmin && !!showEditTools && (
              <Button
                type="primary"
                shape="round"
                size="middle"
                icon={<CameraOutlined />}
                onClick={() => setShowDPModal(true)}
              >
                Upload
              </Button>
            )}
            <div>
              <ShareBtn
                quote={title}
                url={`${FRONTEND_API}/social/profile/${user.accountId}`}
                btnType="default"
                btnSize="middle"
                btnShape="round"
                btnClassName="ml-2"
              />
            </div>
          </div>
          <div className="col-12">
            <div className="h3 font-weight-bold">
              {getUserFullName(user)}&nbsp;&nbsp;
              {(isNil(user.firstName) || isNil(user.lastName)) && (
                <Tag color="error" className="text-uppercase align-top">
                  Needs Update
                </Tag>
              )}
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
                {/* {!user.emailVerified && <VerifyEmailLink />} */}
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
                  <Form.Item name="contactNumber" label="Contact Number">
                    <Input type="number" />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Modal>
          <Modal
            title="Upload Display Picture"
            visible={showDPModal}
            cancelText="Close"
            centered
            okButtonProps={{ style: { display: 'none' } }}
            onCancel={() => setShowDPModal(false)}
            footer={dpFormFooter}
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
