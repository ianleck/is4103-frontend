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
import { ADMIN_VERIFIED_ENUM, STATUS_ENUM } from 'constants/constants'
import {
  formatTime,
  getDetailsColumn,
  showNotification,
  sortDescAndKeyBillingId,
} from 'components/utils'
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

const { TabPane } = Tabs
const { Column } = Table

const SenseiProfileComponent = () => {
  const history = useHistory()
  const { userId } = useParams()
  const user = useSelector(state => state.user)
  const { walletId } = user

  const [sensei, setSensei] = useState('')
  const [mentorshipListings, setMentorshipListings] = useState('')
  const [billingsSent, setBillingsSent] = useState([])
  const [billingsReceived, setBillingsReceived] = useState([])

  const [listingsTabKey, setListingsTabKey] = useState('listings')
  const changeListingsTab = key => {
    setListingsTabKey(key)
  }

  const [billingsTabKey, setBillingsTabKey] = useState('received')
  const changeBillingsTab = key => {
    setBillingsTabKey(key)
  }

  const getSensei = async () => {
    const response = await jwtAdmin.getSensei(userId)
    setSensei(response)
  }
  const getListings = async () => {
    const response = await jwtAdmin.getMentorMentorshipListings(userId)
    setMentorshipListings(response)
  }

  const getWallet = async () => {
    const result = await viewWallet(walletId)
    if (result) {
      if (!isNil(result.wallet.BillingsSent)) {
        setBillingsSent(sortDescAndKeyBillingId(result.wallet.BillingsSent))
      }
      if (!isNil(result.wallet.BillingsReceived)) {
        setBillingsReceived(sortDescAndKeyBillingId(result.wallet.BillingsReceived))
      }
    }
  }

  useEffect(() => {
    getSensei()
    getListings()
    getWallet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const viewBilling = record => {
    const path = `/admin/billing/view/${record.billingId}`
    history.push(path)
  }
  const billingColumnsWithDetail = concat(billingColumns, getDetailsColumn(viewBilling))

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
      <Table dataSource={mentorshipListings} rowKey="mentorshipListingId">
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
          render={createdAt => formatTime(createdAt)}
        />
        <Column
          title="Updated At"
          dataIndex="updatedAt"
          key="updatedAt"
          render={updatedAt => formatTime(updatedAt)}
        />
      </Table>
    )
  }

  const showBillings = (dataSource, tableColumns) => {
    return <Table dataSource={dataSource} columns={tableColumns} />
  }

  const onBan = async () => {
    const response = await jwtAdmin.banUser(userId)

    if (response.success && sensei.status === STATUS_ENUM.ACTIVE) {
      showNotification('success', SUCCESS, USER_BANNED)
    } else if (response.success && sensei.status === STATUS_ENUM.BANNED) {
      showNotification('success', SUCCESS, USER_UNBANNED)
    }
    getSensei()
  }

  return (
    <div>
      <div className="row pt-2 justify-content-md-between">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
        <div className="col-12 col-md-auto col-lg-auto mt-4 mt-md-0 text-center text-md-right">
          {sensei.status === STATUS_ENUM.ACTIVE ? (
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
      {/* Mentorship Listings of a Sensei */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header card-header-flex">
              <div className="d-flex flex-column justify-content-center mr-auto">
                <h5>Mentorship Listings</h5>
              </div>
              <Tabs activeKey={listingsTabKey} className="kit-tabs" onChange={changeListingsTab}>
                <TabPane tab="Mentorship Listings" key="listings" />
              </Tabs>
            </div>
            <div className="card-body">
              {listingsTabKey === 'listings' && showMentorshipListings()}
            </div>
          </div>
        </div>
      </div>
      {/* Billings of a Sensei */}
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
    </div>
  )
}

export default SenseiProfileComponent
