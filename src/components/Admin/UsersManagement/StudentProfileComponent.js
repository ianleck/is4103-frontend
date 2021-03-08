import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import * as jwtAdmin from 'services/jwt/admin'
import { Button } from 'antd'
import { StopOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import ProfilePersonalInfoCard from 'components/Profile/PersonalInformationCard'
import ProfileAboutCard from 'components/Profile/AboutCard'
import ProfileOccupationCard from 'components/Profile/OccupationCard'
import ProfileIndustryCard from 'components/Profile/IndustryCard'
import ProfileExperienceCard from 'components/Profile/ExperienceCard'
import ProfilePersonalityCard from 'components/Profile/PersonalityCard'

const StudentProfileComponent = () => {
  const { userId } = useParams()
  const history = useHistory()
  const [student, setStudent] = useState('')

  useEffect(() => {
    const getStudent = async () => {
      const response = await jwtAdmin.getStudent(userId)
      setStudent(response)
    }
    getStudent()
  }, [userId])

  const onBack = e => {
    e.preventDefault()
    const path = '/admin/user-management/'
    history.push(path)
  }

  const BanAccountActionCard = () => {
    return (
      <div className="card">
        <div className="card-header pb-1">
          <div className="h3 font-weight-bold text-dark">Ban Account</div>
        </div>
        <div className="card-body">
          <div className="row justify-content-start align-items-center">
            <div className="col-auto">
              <Button block type="danger" size="large" shape="round" icon={<StopOutlined />}>
                Ban Account
              </Button>
            </div>
          </div>
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
        <div className="col-12 col-md-6">
          <ProfilePersonalInfoCard user={student} isAdmin />
          <BanAccountActionCard />
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
