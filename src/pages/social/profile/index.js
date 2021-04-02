import { UserOutlined } from '@ant-design/icons'
import { Avatar, Button } from 'antd'
import FollowBtn from 'components/Common/Social/FollowBtn'
import { isNil } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile } from 'services/user'

const SenseiSocialProfile = () => {
  const { accountId } = useParams()
  const [viewUser, setViewUser] = useState('')

  const getUserProfile = async () => {
    if (!isNil(accountId)) {
      const response = await getProfile(accountId)
      if (response) setViewUser(response)
    }
  }

  useEffect(() => {
    getUserProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-5">
          <div className="card">
            <div className="card-header p-0 border-0 overflow-hidden">
              <img
                src="/resources/images/content/mountains.svg"
                className="social-card-banner"
                alt="Social Banner"
              />
              <div className="social-card-avatar">
                <Avatar
                  size={75}
                  icon={<UserOutlined />}
                  src={
                    viewUser.profileImgUrl
                      ? `${viewUser.profileImgUrl}?${new Date().getTime()}`
                      : null
                  }
                />
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6 invisible-btn">
                  <span>Following</span>
                  <br />
                  <h5 className="text-dark font-weight-bold">112</h5>
                </div>
                <div className="col-6 text-right invisible-btn">
                  <span>Followers</span>
                  <br />
                  <h5 className="text-dark font-weight-bold">112</h5>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-6">
                  <FollowBtn targetAccountId={accountId} />
                </div>
                <div className="col-6">
                  <Button block type="default" size="large">
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-7">
          <span>Hello</span>
        </div>
      </div>
    </div>
  )
}

export default SenseiSocialProfile
