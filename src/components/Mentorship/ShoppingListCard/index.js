import React from 'react'
import { useHistory } from 'react-router-dom'
import { Avatar, Button, Rate, Skeleton, Space, Tag } from 'antd'
import { EyeOutlined, UserOutlined } from '@ant-design/icons'
import { isNil } from 'lodash'
import { useSelector } from 'react-redux'
import { USER_TYPE_ENUM } from 'constants/constants'

const MentorshipListingCard = ({ listing, isLoading, className, isUpsellItem }) => {
  const history = useHistory()
  const user = useSelector(state => state.user)
  const viewOnly =
    user.userType === USER_TYPE_ENUM.ADMIN ||
    user.userType === USER_TYPE_ENUM.SENSEI ||
    isUpsellItem

  return (
    <div className={isNil(className) ? 'col-12 col-md-6 col-xl-4' : className}>
      <Skeleton active loading={isLoading}>
        <div
          role="button"
          tabIndex={0}
          className={`card text-left w-100 ${
            viewOnly ? 'defocus-btn font-small' : 'btn p-0 rounded-lg'
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
              <div className="col pl-0">
                <p className="truncate-1-overflow m-0 text-break">
                  {listing?.Sensei?.firstName} {listing?.Sensei?.lastName}
                </p>
                <p className="m-0 text-secondary text-break truncate-1-overflow">
                  {listing?.Sensei?.occupation}
                </p>
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
            {!isUpsellItem && (
              <div className="row">
                <div className="col-12">
                  <span>
                    <Rate disabled defaultValue={listing.rating} />
                  </span>
                </div>
              </div>
            )}
            {!isUpsellItem && (
              <div className="row text-2-lines">
                <div className="col-12">
                  <span className="w-100 mt-2 text-dark truncate-2-overflow">
                    {listing.description}
                  </span>
                </div>
              </div>
            )}
            {!isUpsellItem && (
              <div className="w-100 text-truncate mt-4 pt-3 pb-0 mb-0">
                {listing.Categories?.map(c => {
                  return (
                    <Space key={c.categoryId}>
                      <Tag color="default">{c.name}</Tag>
                    </Space>
                  )
                })}
              </div>
            )}
            {isUpsellItem && (
              <div className="mt-2">
                <Button
                  block
                  type="default"
                  size="large"
                  icon={<EyeOutlined />}
                  onClick={() =>
                    history.push(`/student/mentorship/view/${listing.mentorshipListingId}`)
                  }
                >
                  View
                </Button>
              </div>
            )}
          </div>
        </div>
      </Skeleton>
    </div>
  )
}

export default MentorshipListingCard
