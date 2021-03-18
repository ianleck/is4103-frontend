import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getProfile } from 'services/jwt/index'
import { deleteFromCart } from 'services/jwt/cart'
import { Avatar, Button, notification, Rate } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { SUCCESS } from 'constants/notifications'

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
    <div className="col-12">
      <div
        role="button"
        tabIndex={0}
        className="card btn text-left w-100 "
        onClick={() => redirect(listing.mentorshipListingId)}
        onKeyDown={event => event.preventDefault()}
      >
        <div className="row">
          <div className="col-3">
            <Avatar
              size={150}
              src={
                sensei.profileImgUrl
                  ? `${sensei.profileImgUrl}?${new Date().getTime()}`
                  : GetDefaultProfilePic()
              }
            />
          </div>
          <div className="col-7">
            <h4 className="card-title text-wrap">
              {sensei.firstName} {sensei.lastName}
            </h4>
            <h6 className="card-subtitle mb-2 text-dark text-uppercase text-wrap">
              {listing.name}
            </h6>
            <div className="card-subtitle m-0 text-dark text-wrap">
              Description : {listing.description}
            </div>
            <div className="card-subtitle m-0 text-dark text-wrap">
              <span className="mt2">
                <strong>$ {parseFloat(listing.priceAmount).toFixed(2)}</strong>
              </span>
            </div>
            <Rate disabled allowHalf defaultValue={listing.rating} />
          </div>

          <div className="col-2 float-right">
            <Button danger block onClick={removeClick}>
              <DeleteOutlined />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorshipCard
