import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getProfile } from 'services/jwt/index'
import { deleteFromCart } from 'services/jwt/cart'
import { Avatar, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
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

    await deleteFromCart([], [listing.mentorshipListingId])
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
            size={32}
            src={
              sensei.profileImgUrl
                ? `${sensei.profileImgUrl}?${new Date().getTime()}`
                : GetDefaultProfilePic()
            }
          />
        </div>
        <div className="col pl-0">
          <h6 className="truncate-2-overflow text-wrap">
            {!isNil(sensei.firstName) ? sensei.firstName : 'Anonymous'}{' '}
            {!isNil(sensei.lastName) ? sensei.lastName : 'Pigeon'}
          </h6>
          <div className="text-dark text-wrap">{listing.name}</div>
          <div className="text-dark text-wrap mt-2">
            <span>
              <strong>$ {parseFloat(listing.priceAmount).toFixed(2)}</strong>
            </span>
          </div>
        </div>
        <div className="col-3">
          <Button danger onClick={removeClick}>
            <DeleteOutlined />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MentorshipCard
