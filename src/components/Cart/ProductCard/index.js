import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Avatar, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { isNil } from 'lodash'
import { USER_TYPE_ENUM } from 'constants/constants'
import { getCourseById } from 'services/courses'

const ProductCard = data => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { listing } = data
  const [sensei, setSensei] = useState([])
  const [isCourse, setIsCourse] = useState(false)
  const history = useHistory()
  const currLocation = data.location
  const isStudent = user.userType === USER_TYPE_ENUM.STUDENT

  useEffect(() => {
    const checkSensei = async () => {
      if (!isNil(listing.accountId)) {
        getCourseById(listing.courseId).then(res => {
          if (res && !isNil(res.course?.Sensei)) {
            setSensei(res.course.Sensei)
          }
        })
      }
    }

    const checkCourse = () => {
      if (!isNil(listing.courseId)) {
        setIsCourse(true)
      }
    }
    checkSensei()
    checkCourse()
  }, [listing])

  const redirect = id => {
    if (!isStudent) {
      return
    }
    if (isCourse) {
      history.push({
        pathname: `/courses/${id}`,
      })
    } else {
      history.push({
        pathname: `/student/mentorship/view/${id}`,
      })
    }
  }

  const removeClick = e => {
    e.stopPropagation()
    if (isCourse) {
      dispatch({
        type: 'cart/DELETE_FROM_CART',
        payload: {
          courseIds: [listing.courseId],
          mentorshipListingIds: [],
        },
      })
    } else {
      dispatch({
        type: 'cart/DELETE_FROM_CART',
        payload: {
          courseIds: [],
          mentorshipListingIds: [listing.mentorshipListingId],
        },
      })
    }
  }

  const GetDefaultProfilePic = () => {
    return '/resources/images/course-placeholder.png'
  }

  const getCourseCard = () => {
    if (currLocation === 'CartDropdown') {
      return dropdownCourseCard()
    }

    return courseCard()
  }

  const dropdownCourseCard = () => {
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
                listing.imgUrl
                  ? `${listing.imgUrl}?${new Date().getTime()}`
                  : GetDefaultProfilePic()
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

  const courseCard = () => {
    const needButton = currLocation === 'CartPage'

    return (
      <div
        role="button"
        tabIndex={0}
        className="btn border-0 text-left w-100 mt-4"
        onClick={() => redirect(listing.courseId)}
        onKeyDown={event => event.preventDefault()}
      >
        <div className="row align-items-center">
          <div className="col-auto pl-2">
            <Avatar
              size={64}
              src={
                listing.imgUrl
                  ? `${listing.imgUrl}?${new Date().getTime()}`
                  : GetDefaultProfilePic()
              }
            />
          </div>
          <div className="col pl-2">
            <h5 className="truncate-2-overflow text-wrap font-weight-bold">{listing.title}</h5>
            <span className="mb-2 h6 text-dark text-uppercase text-wrap">
              {!isNil(sensei.firstName) ? sensei.firstName : 'Anonymous'}
              {!isNil(sensei.lastName) ? sensei.lastName : 'Pigeon'}
            </span>
            <div className="truncate-2-overflow text-wrap text-muted">{listing.subTitle}</div>
            <div className="text-dark text-wrap mt-2">
              <span>
                <strong>$ {parseFloat(listing.priceAmount).toFixed(2)}</strong>
              </span>
            </div>
          </div>

          {needButton ? (
            <div className="col-2">
              <Button block danger onClick={removeClick}>
                <DeleteOutlined />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  const getMentorshipCard = () => {
    if (currLocation === 'CartDropdown') {
      return dropdownMentorshipCard()
    }

    return mentorshipCard()
  }

  const dropdownMentorshipCard = () => {
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

  const mentorshipCard = () => {
    const needButton = currLocation === 'CartPage'

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

          {needButton ? (
            <div className="col-2">
              <Button danger block onClick={removeClick}>
                <DeleteOutlined />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return <div>{isCourse ? getCourseCard() : getMentorshipCard()}</div>
}

export default ProductCard
