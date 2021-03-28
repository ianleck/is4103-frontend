import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as jwtAdmin from 'services/admin'
import { Button, Table, Tabs } from 'antd'
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import ProfilePersonalInfoCard from 'components/Profile/PersonalInformationCard'
import ProfileAboutCard from 'components/Profile/AboutCard'
import ProfileOccupationCard from 'components/Profile/OccupationCard'
import ProfileIndustryCard from 'components/Profile/IndustryCard'
import ProfileExperienceCard from 'components/Profile/ExperienceCard'
import ProfilePersonalityCard from 'components/Profile/PersonalityCard'
import ProfileVerificationCard from 'components/Profile/ProfileVerificationCard'
import ProfileUploadFilesCard from 'components/Profile/UploadFilesCard'
import moment from 'moment'
import { ADMIN_VERIFIED_ENUM } from 'constants/constants'
import { showNotification } from 'components/utils'
import {
  SUCCESS,
  ACCEPT_SENSEI_PROFILE,
  REJECT_SENSEI_PROFILE,
  SENSEI_PROFILE_UPDATE_ERR,
  ERROR,
} from 'constants/notifications'

const { TabPane } = Tabs
const { Column } = Table

const SenseiProfileComponent = () => {
  const { userId } = useParams()
  const history = useHistory()
  const user = useSelector(state => state.user)
  const [sensei, setSensei] = useState('')
  const [mentorshipListings, setMentorshipListings] = useState('')

  const [tabKey, setTabKey] = useState('1')
  const changeTab = key => {
    setTabKey(key)
  }

  const getSensei = async () => {
    const response = await jwtAdmin.getSensei(userId)
    setSensei(response)
  }
  const getListings = async () => {
    const response = await jwtAdmin.getMentorMentorshipListings(userId)
    setMentorshipListings(response)
  }

  useEffect(() => {
    getSensei()
    getListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onBack = e => {
    e.preventDefault()
    const path = '/admin/user-management/'
    history.push(path)
  }

  const onAccept = async () => {
    const response = await jwtAdmin.acceptSensei(userId)
    if (response) {
      if (response.adminVerified === ADMIN_VERIFIED_ENUM.ACCEPTED) {
        getSensei()
        getListings()
        showNotification('success', SUCCESS, ACCEPT_SENSEI_PROFILE)
      }
    } else {
      showNotification('error', ERROR, SENSEI_PROFILE_UPDATE_ERR)
    }
  }

  const onReject = async () => {
    const response = await jwtAdmin.rejectSensei(userId)
    if (response) {
      if (response.adminVerified === 'REJECTED') {
        getSensei()
        getListings()
        showNotification('success', SUCCESS, REJECT_SENSEI_PROFILE)
      }
    } else {
      showNotification('error', ERROR, SENSEI_PROFILE_UPDATE_ERR)
    }
  }

  const AdminVerificationCard = () => {
    return (
      <div className="card">
        <div className="card-body">
          <ProfileVerificationCard user={sensei} isAdmin />
          {sensei.adminVerified === ADMIN_VERIFIED_ENUM.PENDING && (
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

  const showMentorshipListings = () => {
    return (
      <Table bordered="true" dataSource={mentorshipListings} rowKey="mentorshipListingId">
        <Column
          title="Mentorship Listing Id"
          dataIndex="mentorshipListingId"
          key="mentorshipListingId"
        />
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Rating" dataIndex="rating" key="rating" />
        <Column
          title="Created At"
          dataIndex="createdAt"
          key="createdAt"
          render={createdAt => moment(createdAt).format('YYYY-MM-DD h:mm:ss a')}
        />
        <Column
          title="Updated At"
          dataIndex="updatedAt"
          key="updatedAt"
          render={updatedAt => moment(updatedAt).format('YYYY-MM-DD h:mm:ss a')}
        />
      </Table>
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
          <ProfilePersonalInfoCard user={sensei} isAdmin />
          <ProfileExperienceCard user={sensei} isAdmin />
        </div>
        <div className="col-12 col-md-6">
          <AdminVerificationCard />
          <ProfileAboutCard user={sensei} />
          <ProfileUploadFilesCard user={sensei} accessToken={user.accessToken} />
          <ProfileIndustryCard user={sensei} />
          <ProfileOccupationCard user={sensei} />
          <ProfilePersonalityCard user={sensei} />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header card-header-flex">
              <div className="d-flex flex-column justify-content-center mr-auto">
                <h5>Mentorship Listings</h5>
              </div>
              <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
                <TabPane tab="Mentorship Listings" key="1" />
              </Tabs>
            </div>
            <div className="card-body">{tabKey === '1' && showMentorshipListings()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SenseiProfileComponent
