import React from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { Alert, Button } from 'antd'
import ProfileCard from 'components/Profile/ProfileCard'

const UpdateProfileNotice = () => {
  return (
    <div className="row mb-3">
      <div className="col-12">
        <Alert
          message="Profile requires update."
          description="Your profile is incomplete. A complete profile is required to perform actions on Digi Dojo."
          type="info"
          showIcon
        />
      </div>
    </div>
  )
}

const StudentProfile = () => {
  const user = useSelector(state => state.user)

  return (
    <div>
      <Helmet title="Profile" />
      {user.requiresProfileUpdate && <UpdateProfileNotice />}
      <div className="row">
        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <ProfileCard />
            </div>
          </div>
        </div>
        <div className="col-xl-8 col-lg-12">
          <div className="card">
            <div className="card-header pb-1">
              <div className="h3 font-weight-bold text-dark">About</div>
            </div>
            <div className="card-body">
              <div className="row align-items-center justify-content-between">
                <div className="col-auto">
                  <span className="h4 text-dark">Headliner</span>
                </div>
                <div className="col-auto">
                  <Button
                    type="primary"
                    shape="round"
                    icon={<i className="fe fe-edit-3" />}
                    size="small"
                  >
                    Edit
                  </Button>
                </div>
                <div className="col-12 mt-4">
                  <div className="card">
                    <div className="card-body">
                      <span>Headliner body</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row align-items-center justify-content-between">
                <div className="col-auto">
                  <span className="h4 text-dark">Description</span>
                </div>
                <div className="col-auto">
                  <Button
                    type="primary"
                    shape="round"
                    icon={<i className="fe fe-edit-3" />}
                    size="small"
                  >
                    Edit
                  </Button>
                </div>
                <div className="col-12 mt-4">
                  <div className="card">
                    <div className="card-body">
                      <span>Description body</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
