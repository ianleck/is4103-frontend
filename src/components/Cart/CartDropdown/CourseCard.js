import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getProfile } from 'services/jwt/index'
import { Avatar, Button } from 'antd'
import { deleteFromCart } from 'services/jwt/cart'
import { DeleteOutlined } from '@ant-design/icons'

const CourseCard = data => {
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
      pathname: `/courses/${id}`,
    })
  }

  const removeClick = async e => {
    e.stopPropagation()

    const response = await deleteFromCart([listing.courseId], [])
    console.log('response', response)
  }

  const GetDefaultProfilePic = () => {
    return '/resources/images/course-placeholder.png'
  }

  return (
    <div className="col-12">
      <div
        role="button"
        tabIndex={0}
        className="card btn text-left w-100 "
        onClick={() => redirect(listing.courseId)}
        onKeyDown={event => event.preventDefault()}
      >
        <div className="row">
          <div className="col-auto">
            <Avatar
              size={70}
              src={
                listing.imgUrl
                  ? `${listing.imgUrl}?${new Date().getTime()}`
                  : GetDefaultProfilePic()
              }
            />
          </div>
          <div className="col">
            <h4 className="card-title text-wrap">{listing.title}</h4>
            <h6 className="card-subtitle m-0 text-dark text-uppercase text-wrap">
              {sensei.firstName} {sensei.lastName}
            </h6>
            <div className="card-subtitle m-0 text-dark text-uppercase text-wrap">
              Price : $ {listing.priceAmount}
            </div>
            <div className="mt-2">
              <Button block onClick={removeClick}>
                <DeleteOutlined /> Remove from Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
