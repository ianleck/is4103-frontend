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
          <div className="col-4">
            <Avatar
              size={80}
              src={
                listing.imgUrl
                  ? `${listing.imgUrl}?${new Date().getTime()}`
                  : GetDefaultProfilePic()
              }
            />
          </div>
          <div className="col-5">
            <h4 className="card-title text-wrap">{listing.title}</h4>
            <div className="font-size-12 m-0 text-dark">
              {sensei.firstName} {sensei.lastName}
            </div>
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

export default CourseCard
