import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as jwtAdmin from 'services/admin'
import { Button, Popconfirm, Table, Tabs } from 'antd'
import { CheckOutlined, CloseOutlined, StopOutlined } from '@ant-design/icons'
import ProfilePersonalInfoCard from 'components/Profile/PersonalInformationCard'
import ProfileAboutCard from 'components/Profile/AboutCard'
import ProfileOccupationCard from 'components/Profile/OccupationCard'
import ProfileIndustryCard from 'components/Profile/IndustryCard'
import ProfileExperienceCard from 'components/Profile/ExperienceCard'
import ProfilePersonalityCard from 'components/Profile/PersonalityCard'
import ProfileVerificationCard from 'components/Profile/ProfileVerificationCard'
import ProfileUploadFilesCard from 'components/Profile/UploadFilesCard'
import {
  ADMIN_ROLE_ENUM,
  ADMIN_VERIFIED_ENUM,
  STATUS_ENUM,
  USER_TYPE_ENUM,
} from 'constants/constants'
import { getDetailsColumn, showNotification, sortDescAndKeyBillingId } from 'components/utils'
import {
  SUCCESS,
  ACCEPT_SENSEI_PROFILE,
  REJECT_SENSEI_PROFILE,
  SENSEI_PROFILE_UPDATE_ERR,
  ERROR,
  USER_BANNED,
  USER_UNBANNED,
} from 'constants/notifications'
import billingColumns from 'components/Common/TableColumns/Billing'
import BackBtn from 'components/Common/BackBtn'
import { viewWallet } from 'services/wallet'
import { concat, isNil } from 'lodash'
import Mentorship from './MentorshipListing'
import MentorshipContracts from './MentorshipContracts'

const SenseiProfileComponent = () => {
  const { TabPane } = Tabs
  const history = useHistory()
  const { userId } = useParams()
  const user = useSelector(state => state.user)
  const isAdminRole = user.role === ADMIN_ROLE_ENUM.ADMIN

  const [viewUser, setViewUser] = useState('')
  const [isSensei, setIsSensei] = useState(false)
  const [billingsSent, setBillingsSent] = useState([])
  const [billingsReceived, setBillingsReceived] = useState([])

  const [billingsTabKey, setBillingsTabKey] = useState('received')
  const changeBillingsTab = key => {
    setBillingsTabKey(key)
  }

  const getWallet = async senseiWalletId => {
    const result = await viewWallet(senseiWalletId)
    if (result && !isNil(result.wallet)) {
      if (!isNil(result.wallet.BillingsSent)) {
        setBillingsSent(sortDescAndKeyBillingId(result.wallet.BillingsSent))
      }
      if (!isNil(result.wallet.BillingsReceived)) {
        setBillingsReceived(sortDescAndKeyBillingId(result.wallet.BillingsReceived))
      }
    }
  }

  const getProfile = async () => {
    const response = await jwtAdmin.getProfile(userId)
    if (response && !isNil(response.userType)) {
      console.log('response', response)
      setViewUser(response)
      setIsSensei(response.userType === USER_TYPE_ENUM.SENSEI)
    }
    if (!isAdminRole && response.userType === USER_TYPE_ENUM.SENSEI) {
      getWallet(response.walletId)
    }
  }

  const onAccept = async () => {
    const response = await jwtAdmin.acceptSensei(userId)
    if (response) {
      if (response.adminVerified === ADMIN_VERIFIED_ENUM.ACCEPTED) {
        getProfile()
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
        getProfile()
        showNotification('success', SUCCESS, REJECT_SENSEI_PROFILE)
      }
    } else {
      showNotification('error', ERROR, SENSEI_PROFILE_UPDATE_ERR)
    }
  }

  const viewBilling = record => {
    const path = `/admin/billing/view/${record.billingId}`
    history.push(path)
  }
  const billingColumnsWithDetail = concat(billingColumns, getDetailsColumn(viewBilling))

  const showBillings = (dataSource, tableColumns) => {
    return <Table dataSource={dataSource} columns={tableColumns} />
  }

  const onBan = async () => {
    const response = await jwtAdmin.banUser(userId)

    if (response.success && viewUser.status === STATUS_ENUM.ACTIVE) {
      showNotification('success', SUCCESS, USER_BANNED)
    } else if (response.success && viewUser.status === STATUS_ENUM.BANNED) {
      showNotification('success', SUCCESS, USER_UNBANNED)
    }
    getProfile()
  }

  useEffect(() => {
    getProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const AdminVerificationCard = () => {
    return (
      <div className="card">
        <div className="card-body">
          <ProfileVerificationCard user={viewUser} isAdmin />
          {viewUser.adminVerified === ADMIN_VERIFIED_ENUM.PENDING && (
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

  return (
    <div>
      <div className="row pt-2 justify-content-md-between">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
        <div className="col-12 col-md-auto col-lg-auto mt-4 mt-md-0 text-center text-md-right">
          {viewUser.status === STATUS_ENUM.ACTIVE ? (
            <Popconfirm
              title="Do you wish to ban this sensei?"
              onConfirm={onBan}
              okText="Confirm"
              okType="danger"
            >
              <Button danger block shape="round" size="large" icon={<StopOutlined />}>
                Ban Account
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Do you wish to unban this sensei?"
              onConfirm={onBan}
              okText="Confirm"
              okType="danger"
            >
              <Button danger block shape="round" size="large" icon={<StopOutlined />}>
                Unban Account
              </Button>
            </Popconfirm>
          )}
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12 col-md-6">
          <ProfilePersonalInfoCard user={viewUser} isAdmin />
          <ProfileExperienceCard user={viewUser} isAdmin />
        </div>
        <div className="col-12 col-md-6">
          {isSensei && <AdminVerificationCard />}
          <ProfileAboutCard user={viewUser} />
          <ProfileUploadFilesCard user={viewUser} accessToken={user.accessToken} />
          <ProfileIndustryCard user={viewUser} />
          <ProfileOccupationCard user={viewUser} />
          <ProfilePersonalityCard user={viewUser} />
        </div>
      </div>
      {!isSensei && (
        <div className="row mt-4">
          <div className="col-12">
            <MentorshipContracts id={userId} />
          </div>
        </div>
      )}
      {/* Mentorship Listings of a Sensei */}
      {isSensei && (
        <div className="row mt-4">
          <div className="col-12">
            <Mentorship id={userId} user={viewUser} />
          </div>
        </div>
      )}
      {/* Billings of a Sensei - cannot be viewed by admins with just ADMIN role */}
      {!isAdminRole && isSensei && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header card-header-flex">
                <div className="d-flex flex-column justify-content-center mr-auto">
                  <h5>Billings</h5>
                </div>
                <Tabs activeKey={billingsTabKey} className="kit-tabs" onChange={changeBillingsTab}>
                  <TabPane tab="Received" key="received" />
                  <TabPane tab="Sent" key="sent" />
                </Tabs>
              </div>
              <div className="card-body overflow-x-scroll mr-3 mr-sm-0">
                {billingsTabKey === 'received' &&
                  showBillings(billingsReceived, billingColumnsWithDetail)}
                {billingsTabKey === 'sent' && showBillings(billingsSent, billingColumnsWithDetail)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SenseiProfileComponent
