import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getProfile } from 'services/jwt/index'
import { deleteFromCart } from 'services/jwt/cart'
import { Avatar, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

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
    <div className="col-12">
      <div
        role="button"
        tabIndex={0}
        className="card btn text-left w-100 "
        onClick={() => redirect(listing.mentorshipListingId)}
        onKeyDown={event => event.preventDefault()}
      >
        <div className="row">
          <div className="col-4">
            <Avatar
              size={80}
              src={
                sensei.profileImgUrl
                  ? `${sensei.profileImgUrl}?${new Date().getTime()}`
                  : GetDefaultProfilePic()
              }
            />
          </div>
          <div className="col-5">
            <h4 className="card-title text-wrap">
              {sensei.firstName} {sensei.lastName}
            </h4>
            <h6 className="card-subtitle m-0 text-dark text-wrap">{listing.name}</h6>
            <div className="card-subtitle m-0 text-dark text-wrap">
              <span className="mt2">
                <strong>$ {parseFloat(listing.priceAmount).toFixed(2)}</strong>
              </span>
            </div>
          </div>
          <div className="col-3 m-0 float-right">
            <Button danger onClick={removeClick}>
              <DeleteOutlined />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorshipCard
