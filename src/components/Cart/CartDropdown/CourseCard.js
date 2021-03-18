import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getProfile } from 'services/jwt/index'
import { Avatar, Button } from 'antd'
import { deleteFromCart } from 'services/jwt/cart'
import { DeleteOutlined } from '@ant-design/icons'
import { isNil } from 'lodash'

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
    <div
      role="button"
      tabIndex={0}
      className="btn border-0 text-left w-100 mt-2"
      onClick={() => redirect(listing.courseId)}
      onKeyDown={event => event.preventDefault()}
    >
      <div className="row align-items-center">
        <div className="col-auto pl-2">
          <Avatar
            size={32}
            src={
              listing.imgUrl ? `${listing.imgUrl}?${new Date().getTime()}` : GetDefaultProfilePic()
            }
          />
        </div>
        <div className="col pl-0">
          <h6 className="truncate-2-overflow text-wrap">{listing.title}</h6>
          <small className="text-dark">
            {!isNil(sensei.firstName) ? sensei.firstName : 'Anonymous'}{' '}
            {!isNil(sensei.lastName) ? sensei.lastName : 'Pigeon'}
          </small>
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

export default CourseCard
