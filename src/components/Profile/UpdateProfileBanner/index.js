import React from 'react'
import { Alert } from 'antd'

const UpdateProfileNotice = () => {
  return (
    <div className="row mb-3">
      <div className="col-12">
        <Alert
          banner
          closable
          message="Profile requires update."
          description="Your profile is incomplete. A complete profile is required to perform actions on Digi Dojo. Please make sure your About, Personal Information and Interests sections are completed."
          type="info"
          showIcon
        />
      </div>
    </div>
  )
}

export default UpdateProfileNotice
