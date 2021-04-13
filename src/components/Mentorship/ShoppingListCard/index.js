import React from 'react'
import { useHistory } from 'react-router-dom'
import { Avatar, Rate, Space, Tag } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { isNil, random } from 'lodash'
import { useSelector } from 'react-redux'
import { USER_TYPE_ENUM } from 'constants/constants'

const MentorshipListingCard = data => {
  const { listing, className } = data
  const history = useHistory()
  const user = useSelector(state => state.user)
  const viewOnly = user.userType === USER_TYPE_ENUM.ADMIN || user.userType === USER_TYPE_ENUM.SENSEI

  return (
    <div className={isNil(className) ? 'col-12 col-md-6 col-xl-4' : className}>
      <div
        role="button"
        tabIndex={0}
        className={`card text-left w-100 mentorship-listing-card ${
          viewOnly ? 'defocus-btn' : 'btn p-0 rounded-lg'
        }`}
        onClick={() =>
          !viewOnly && history.push(`/student/mentorship/view/${listing.mentorshipListingId}`)
        }
        onKeyDown={event => event.preventDefault()}
      >
        <div className="card-header pl-2 pt-1 pb-1 text-secondary">
          <span>
            <i className="fa fa-graduation-cap" />
            &nbsp;&nbsp;MENTORSHIP
          </span>
        </div>
        <div className="card-body">
          <div className="row align-items-center justify-content-start">
            <div className="col-auto">
              <Avatar
                size={42}
                icon={<UserOutlined />}
                src={
                  listing.Sensei?.profileImgUrl
                    ? listing.Sensei?.profileImgUrl
                    : '/resources/images/avatars/avatar-2.png'
                }
              />
            </div>
            <div className="col-auto pl-0">
              <p className="m-0 text-dark text-wrap">
                {listing?.Sensei?.firstName} {listing?.Sensei?.lastName}
              </p>
              <p className="m-0 text-secondary text-wrap">{listing?.Sensei?.occupation}</p>
            </div>
          </div>
          <div className="row mt-4 text-2-lines">
            <div className="col-12">
              <span className="card-title w-100 mb-0 h5 text-dark font-weight-bold truncate-2-overflow">
                {listing.name}
              </span>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <span className="font-weight-bold">${listing.priceAmount.toFixed(2)}/month</span>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <span>
                <Rate disabled defaultValue={random(0, 5)} />
                <small>&nbsp;&nbsp;{random(1, 15000)}</small>
              </span>
            </div>
          </div>
          <div className="row text-2-lines">
            <div className="col-12">
              <span className="w-100 mt-2 text-dark truncate-2-overflow">
                {listing.description}
              </span>
            </div>
          </div>
          <div className="w-100 text-truncate mt-4 pt-3 pb-0 mb-0">
            {listing.Categories?.map(c => {
              return (
                <Space key={c.categoryId}>
                  <Tag color="default">{c.name}</Tag>
                </Space>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorshipListingCard
