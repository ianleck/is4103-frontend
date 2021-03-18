import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getProfile } from 'services/jwt/index'
import { deleteFromCart } from 'services/jwt/cart'
import { Avatar, Button, notification } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { SUCCESS } from 'constants/notifications'
import { isNil } from 'lodash'

const MentorshipCard = data => {
  const { listing } = data
  const [sensei, setSensei] = useState([])
  const history = useHistory()

  useEffect(() => {
    getProfile(listing.accountId).then(res => {
      if (res) {
        setSensei(res)
      }
    })
  }, [listing.accountId])

  const redirect = id => {
    history.push({
      pathname: `/student/mentorship/view/${id}`,
    })
  }

  const GetDefaultProfilePic = () => {
    return '/resources/images/avatars/master.png'
  }

  const removeClick = async e => {
    e.stopPropagation()

    const response = await deleteFromCart([], [listing.mentorshipListingId])
    if (response) {
      notification.success({
        message: SUCCESS,
        description: response.message,
      })
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className="btn border-0 text-left w-100 mt-2"
      onClick={() => redirect(listing.mentorshipListingId)}
      onKeyDown={event => event.preventDefault()}
    >
      <div className="row align-items-center">
        <div className="col-auto pl-2">
          <Avatar
            size={64}
            src={
              sensei.profileImgUrl
                ? `${sensei.profileImgUrl}?${new Date().getTime()}`
                : GetDefaultProfilePic()
            }
          />
        </div>
        <div className="col pl-2">
          <h5 className="truncate-2-overflow text-wrap font-weight-bold">
            {!isNil(sensei.firstName) ? sensei.firstName : 'Anonymous'}{' '}
            {!isNil(sensei.lastName) ? sensei.lastName : 'Pigeon'}
          </h5>
          <div className="mt-3 truncate-2-overflow text-dark text-uppercase text-wrap">
            {listing.name}
          </div>
          <div className="truncate-2-overflow text-dark text-wrap">{listing.description}</div>
          <div className="text-dark text-wrap mt-2">
            <span>
              <strong>$ {parseFloat(listing.priceAmount).toFixed(2)}</strong>
            </span>
          </div>
        </div>

        <div className="col-2">
          <Button danger block onClick={removeClick}>
            <DeleteOutlined />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MentorshipCard
