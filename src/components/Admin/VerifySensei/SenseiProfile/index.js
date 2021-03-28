import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import * as jwtAdmin from 'services/jwt/admin'
import { Button, notification } from 'antd'
import { CheckOutlined, CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import ProfilePersonalInfoCard from 'components/Profile/PersonalInformationCard'
import ProfileAboutCard from 'components/Profile/AboutCard'
import ProfileOccupationCard from 'components/Profile/OccupationCard'
import ProfileIndustryCard from 'components/Profile/IndustryCard'
import ProfileExperienceCard from 'components/Profile/ExperienceCard'
import ProfilePersonalityCard from 'components/Profile/PersonalityCard'
import ProfileVerificationCard from 'components/Profile/ProfileVerificationCard'
import ProfileUploadFilesCard from 'components/Profile/UploadFilesCard'
import { ADMIN_VERIFIED_ENUM } from 'constants/constants'

const MentorProfile = () => {
  const history = useHistory()
  const user = useSelector(state => state.user)
  const { mentorId } = useParams()
  const [mentor, setMentor] = useState('')

  useEffect(() => {
    const getMentors = async () => {
      const response = await jwtAdmin.getSensei(mentorId)
      setMentor(response)
    }
    getMentors()
  }, [mentorId])

  const onBack = e => {
    e.preventDefault()
    const path = '/admin/user-management/verify-senseis/'
    history.push(path)
  }

  const onAccept = async () => {
    const response = await jwtAdmin.acceptSensei(mentorId)
    if (response) {
      if (response.adminVerified === 'ACCEPTED') {
        notification.success({ message: 'Success', description: 'Sensei Verified' })
        const path = '/admin/user-management/verify-senseis/'
        history.push(path)
        history.push()
      }
    } else {
      notification.error({ message: 'Error', description: response.message })
    }
  }

  const onReject = async () => {
    const response = await jwtAdmin.rejectSensei(mentorId)
    if (response) {
      if (response.adminVerified === 'REJECTED') {
        notification.success({ message: 'Success', description: 'Sensei Rejected' })
        const path = '/admin/user-management/verify-senseis/'
        history.push(path)
      }
    } else {
      notification.error({ message: 'Error', description: response.message })
    }
  }

  const AdminVerificationCard = () => {
    return (
      <div className="card">
        <div className="card-body">
          <ProfileVerificationCard user={mentor} isAdmin />
          {mentor.adminVerified === ADMIN_VERIFIED_ENUM.PENDING && (
            <div className="row justify-content-end">
              <div className="col-auto mt-2 mt-sm-0">
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
              <div className="col-auto mt-2 mt-sm-0">
                <Button
                  type="danger"
                  shape="round"
                  size="large"
                  icon={<CloseOutlined />}
                  onClick={() => onReject()}
                >
                  Reject Sensei
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
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
        <div className="col-xl-6 col-lg-12">
          <ProfilePersonalInfoCard user={mentor} isAdmin />
          <ProfileExperienceCard user={mentor} />
        </div>
        <div className="col-xl-6 col-lg-12">
          <AdminVerificationCard />
          <ProfileAboutCard user={mentor} />
          <ProfileUploadFilesCard user={mentor} accessToken={user.accessToken} />
          <ProfileIndustryCard user={mentor} />
          <ProfileOccupationCard user={mentor} />
          <ProfilePersonalityCard user={mentor} />
        </div>
      </div>
    </div>
  )
}

export default MentorProfile
