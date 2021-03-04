import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Popconfirm } from 'antd'
import { ADMIN_VERIFIED_ENUM } from 'constants/constants'

const ProfileVerificationCard = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [showSubmitProfile, setShowSubmitProfile] = useState(false)

  const onSubmitProfile = () => {
    dispatch({
      type: 'user/UPDATE_PROFILE',
      payload: {
        accountId: user.accountId,
        adminVerified: ADMIN_VERIFIED_ENUM.PENDING,
      },
    })
  }

  const handleCancel = () => {
    setShowSubmitProfile(false)
  }

  let colourClass = ''
  let status = ''
  let message = ''

  if (user.adminVerified) {
    switch (user.adminVerified) {
      case ADMIN_VERIFIED_ENUM.SHELL:
        colourClass = 'bg-light text-dark'
        status = 'Pending Submission for Approval'
        message =
          "You will need to go through Digi Dojo's verification process to certify you as a mentor before being able to list mentorships or create courses."
        break
      case ADMIN_VERIFIED_ENUM.PENDING:
        colourClass = 'bg-secondary text-white'
        status = 'Pending Approval'
        message =
          'Your application has been received and is pending verification from Digi Dojo. You will receive an email once your application is approved.'
        break
      case ADMIN_VERIFIED_ENUM.REJECTED:
        colourClass = 'bg-danger text-white'
        status = 'Rejected'
        message =
          'Your application has been rejected. You may wish to review your profile and re-submit your profile for approval.'
        break
      default:
        break
    }
  }

  const SubmitForVerificationBtn = () => {
    return (
      <div className="col-12 mt-3">
        <Popconfirm
          title="Do you wish to submit your profile for verification?"
          visible={showSubmitProfile}
          onConfirm={onSubmitProfile}
          okText="Submit"
          okType="primary"
          okButtonProps={{ loading: user.loading }}
          onCancel={handleCancel}
        >
          <Button
            block
            type="default"
            shape="round"
            icon={<i className="fe fe-sunrise" />}
            size="large"
            onClick={() => setShowSubmitProfile(true)}
          >
            &nbsp;&nbsp;Submit my profile for approval
          </Button>
        </Popconfirm>
      </div>
    )
  }

  return (
    <div className={`card ${colourClass}`}>
      <div className="card-body">
        <div className="row">
          <div className="col-12">
            <span className="h3 font-weight-bold">Current Verification Status</span>
          </div>
          <div className="col-12 mt-4">
            <span className="h5 font-weight-bold">{status}</span>
          </div>
          <div className="col-12 mt-2">
            <span>{message}</span>
          </div>
          {(user.adminVerified === ADMIN_VERIFIED_ENUM.SHELL ||
            user.adminVerified === ADMIN_VERIFIED_ENUM.REJECTED) && <SubmitForVerificationBtn />}
        </div>
      </div>
    </div>
  )
}

export default ProfileVerificationCard
