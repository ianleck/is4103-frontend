import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import * as jwtAdmin from 'services/jwt/admin'
import { Button, Descriptions, notification } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import Axios from 'axios'
import download from 'js-file-download'
import { useSelector } from 'react-redux'

const MentorProfile = () => {
  const history = useHistory()
  const user = useSelector(state => state.user)
  const { mentorId } = useParams()
  const [mentor, setMentor] = useState({
    accountId: '',
    adminVerified: '',
    bio: '',
    contactNumber: null,
    createdAt: '',
    deletedAt: null,
    email: '',
    emailVerified: false,
    firstName: null,
    headline: null,
    industry: null,
    lastName: null,
    occupation: null,
    paypalId: null,
    personality: null,
    privacy: '',
    status: '',
    updatedAt: '',
    userType: '',
    username: '',
  })

  useEffect(() => {
    const getMentors = async () => {
      const response = await jwtAdmin.getSensei(mentorId)
      setMentor(response)
      console.log(response)
    }
    getMentors()
  }, [mentorId])

  const convertDateFromSystem = date => {
    return date.substring(0, 10)
  }

  const onBack = e => {
    e.preventDefault()
    const path = '/admin/user-management/verify-senseis/'
    history.push(path)
  }

  const onAccept = async () => {
    const response = await jwtAdmin.acceptSensei(mentorId)
    if (response.adminVerified === 'ACCEPTED') {
      notification.success({ message: 'Success', description: 'Sensei Verified' })
      const path = '/admin/user-management/verify-senseis/'
      history.push(path)
      history.push()
    } else {
      notification.error({ message: 'Error', description: { response } })
    }
  }

  const onReject = async () => {
    const response = await jwtAdmin.rejectSensei(mentorId)
    if (response.adminVerified === 'REJECTED') {
      notification.success({ message: 'Success', description: 'Sensei Rejected' })
      const path = '/admin/user-management/verify-senseis/'
      history.push(path)
    } else {
      notification.error({ message: 'Error', description: { response } })
    }
  }

  const downloadFile = isTranscript => {
    Axios.get(isTranscript ? mentor.transcriptUrl : mentor.cvUrl, {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
      responseType: 'blob', // Important
    }).then(resp => {
      download(
        resp.data,
        isTranscript
          ? `transcript.${mentor.transcriptUrl.split('.').pop()}`
          : `cv.${mentor.cvUrl.split('.').pop()}`,
      )
    })
  }

  return (
    <div>
      <div className="row">
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
        <div className="col-12 col-md-8">
          <div className="card">
            <div className="card-body">
              <Descriptions title="Mentor's Information" bordered column={2}>
                <Descriptions.Item label="Account ID">
                  {mentor.accountId ? mentor.accountId : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Username">
                  {mentor.username ? mentor.username : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="First Name">
                  {mentor.firstName ? mentor.firstName : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Last Name">
                  {mentor.lastName ? mentor.lastName : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Headline">
                  {mentor.headline ? mentor.headline : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Bio">{mentor.bio ? mentor.bio : '-'}</Descriptions.Item>
                <Descriptions.Item label="Industry">
                  {mentor.industry ? mentor.industry : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Occupation">
                  {mentor.occupation ? mentor.occupation : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Personality">
                  {mentor.personality ? mentor.personality : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Privacy">
                  {mentor.privacy ? mentor.privacy : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="User Type">
                  {mentor.userType ? mentor.userType : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Paypal ID">
                  {mentor.paypalId ? mentor.paypalId : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="CreatedAt">
                  {mentor.createdAt ? convertDateFromSystem(mentor.createdAt) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {mentor.email ? mentor.email : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Email Verified">
                  {mentor.emailVerified ? mentor.emailVerified : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Admin Verified">
                  {mentor.adminVerified ? mentor.adminVerified : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {mentor.status ? mentor.status : '-'}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>

          <div className="row justify-content-end">
            <div className="col-auto">
              <Button
                type="primary"
                shape="round"
                size="large"
                icon={<CheckOutlined />}
                onClick={() => onAccept()}
              >
                Accept Sensei
              </Button>
            </div>
            <div className="col-auto">
              <Button
                danger
                shape="round"
                size="large"
                icon={<CloseOutlined />}
                onClick={() => onReject()}
              >
                Reject Sensei
              </Button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 mt-4 mt-md-0">
          <div className="card">
            <div className="card-body">
              <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {mentor.firstName ? mentor.firstName : 'Anonymous'}{' '}
                {mentor.lastName ? mentor.lastName : 'Shi Fu'}
              </h4>
              <img
                style={{ width: '100%' }}
                src="/resources/images/avatars/sensei.png"
                alt="Mary Stanform"
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
                icon={<DownloadOutlined />}
                onClick={() => downloadFile(true)}
              >
                Transcript
              </Button>
            </div>
            <div className="col-12 mt-4">
              <Button
                block
                type="primary"
                size="large"
                shape="round"
                icon={<DownloadOutlined />}
                onClick={() => downloadFile(false)}
              >
                CV
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorProfile
