import { Avatar } from 'antd'
import { getUserFullName } from 'components/utils'
import React from 'react'

const MentorshipHeader = ({ listing, children }) => {
  return (
    <div className="col-12 pl-0 pr-0 mt-4">
      <div className="card">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-auto col-lg-auto">
              <Avatar
                src={
                  listing.Sensei?.profileImgUrl
                    ? listing.Sensei?.profileImgUrl
                    : '/resources/images/avatars/avatar-2.png'
                }
                size={48}
              />
            </div>
            <div className="col-10 col-lg-5 col-xl-6">
              <span className="h5">{listing.name}</span>
              <br />
              <small className="text-muted">{`by ${getUserFullName(listing.Sensei)}`}</small>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorshipHeader
