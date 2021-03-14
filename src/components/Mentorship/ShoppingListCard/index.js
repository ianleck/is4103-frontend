import React from 'react'
import { useHistory } from 'react-router-dom'
import { Avatar, Divider, Rate, Space, Tag } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { random, round } from 'lodash'

const MentorshipListingCard = data => {
  const { listing } = data
  const history = useHistory()
  const redirect = id => {
    history.push({
      pathname: `/student/mentorship/view/${id}`,
    })
  }

  return (
    <div className="col-12 col-md-6 col-xl-4">
      <div
        role="button"
        tabIndex={0}
        className="card btn text-left w-100 mentorship-listing-card"
        onClick={() => redirect(listing.mentorshipListingId)}
        onKeyDown={event => event.preventDefault()}
      >
        <div className="card-header p-0 text-secondary">
          <span>
            <i className="fa fa-graduation-cap" />
            &nbsp;&nbsp;MENTORSHIP
          </span>
        </div>
        <div className="card-body pt-3 pl-2 pr-2 pb-2">
          <div className="row align-items-center justify-content-start">
            <div className="col-auto">
              <Avatar size={42} icon={<UserOutlined />} />
            </div>
            <div className="col-auto pl-0">
              <p className="m-0 text-dark text-uppercase text-wrap">
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
              <span className="font-weight-bold">${round(random(19.99, 39.99), 2)}/month</span>
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
          <Divider className="mt-4 mb-3" />
          <div className="w-100 text-truncate">
            {listing.Categories?.map(c => {
              return (
                <Space key={c.categoryId}>
                  <Tag className="mb-2" color="default">
                    {c.name}
                  </Tag>
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
