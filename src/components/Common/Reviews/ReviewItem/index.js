import React from 'react'
import { useHistory } from 'react-router-dom'
import { Avatar, Rate, Skeleton, Tag } from 'antd'
import { getImage, getUserFirstName, sendToSocialProfile } from 'components/utils'

const ReviewItem = ({ review, isReviewLoading }) => {
  const history = useHistory()

  return (
    <Skeleton active loading={isReviewLoading}>
      <div className="row align-items-center mt-4">
        <div className="col-auto">
          <Avatar src={getImage('user', review?.User)} size={32} />
        </div>
        <div
          role="button"
          tabIndex={0}
          className="col-6 text-break defocus-btn clickable"
          onClick={() => sendToSocialProfile(history, review?.User.accountId)}
          onKeyDown={e => e.preventDefault()}
        >
          <span className="font-weight-bold">{getUserFirstName(review?.User)}</span>
          <div>
            <Tag className="align-middle">Purchased</Tag>
          </div>
        </div>
        <div className="col-auto ml-auto align-self-start">
          <Rate disabled defaultValue={review?.rating} />
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-12">
          <span className="description-body">{review?.comment}</span>
        </div>
      </div>
    </Skeleton>
  )
}

export default ReviewItem
