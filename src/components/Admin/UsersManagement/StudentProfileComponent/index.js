import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as jwtAdmin from 'services/admin'
import { Button } from 'antd'
import { StopOutlined } from '@ant-design/icons'
import ProfilePersonalInfoCard from 'components/Profile/PersonalInformationCard'
import ProfileAboutCard from 'components/Profile/AboutCard'
import ProfileOccupationCard from 'components/Profile/OccupationCard'
import ProfileIndustryCard from 'components/Profile/IndustryCard'
import ProfileExperienceCard from 'components/Profile/ExperienceCard'
import ProfilePersonalityCard from 'components/Profile/PersonalityCard'
import BackBtn from 'components/Common/BackBtn'
import { showNotification } from 'components/utils'
import { SUCCESS, USER_BANNED, USER_UNBANNED } from 'constants/notifications'
import { STATUS_ENUM } from 'constants/constants'

const StudentProfileComponent = () => {
  const { userId } = useParams()
  const [student, setStudent] = useState('')

  const getStudent = async () => {
    const response = await jwtAdmin.getStudent(userId)
    setStudent(response)
  }

  useEffect(() => {
    getStudent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const onBan = async () => {
    const response = await jwtAdmin.banUser(userId)

    if (response.success && student.status === STATUS_ENUM.ACTIVE) {
      showNotification('success', SUCCESS, USER_BANNED)
    } else if (response.success && student.status === STATUS_ENUM.BANNED) {
      showNotification('success', SUCCESS, USER_UNBANNED)
    }
    getStudent()
  }

  return (
    <div>
      <div className="row pt-2 justify-content-md-between">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
        <div className="col-12 col-md-auto col-lg-auto mt-4 mt-md-0 text-center text-md-right">
          {student.status === 'ACTIVE' ? (
            <Button
              danger
              block
              shape="round"
              size="large"
              icon={<StopOutlined />}
              onClick={() => onBan()}
            >
              Ban Account
            </Button>
          ) : (
            <Button
              danger
              block
              shape="round"
              size="large"
              icon={<StopOutlined />}
              onClick={() => onBan()}
            >
              Unban Account
            </Button>
          )}
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12 col-md-6">
          <ProfilePersonalInfoCard user={student} isAdmin />
          <ProfileExperienceCard user={student} isAdmin />
        </div>
        <div className="col-12 col-md-6">
          <ProfileAboutCard user={student} />
          <ProfileIndustryCard user={student} />
          <ProfileOccupationCard user={student} />
          <ProfilePersonalityCard user={student} />
        </div>
      </div>
    </div>
  )
}

export default StudentProfileComponent
