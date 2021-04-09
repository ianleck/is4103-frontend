import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getProfile } from 'services/user/index'
import { Avatar, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { isNil } from 'lodash'
import { USER_TYPE_ENUM } from 'constants/constants'
import { getUserFullName } from 'components/utils'

const ProductCard = data => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { listing, isBilling, isCourse } = data
  const [sensei, setSensei] = useState([])
  const history = useHistory()
  const currLocation = data.location
  const isStudent = user.userType === USER_TYPE_ENUM.STUDENT

  useEffect(() => {
    const checkSensei = async () => {
      if (!isNil(listing.accountId)) {
        const res = await getProfile(listing.accountId)
        if (res) {
          setSensei(res)
        }
      }
    }

    checkSensei()
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
    if (isCourse) {
      return '/resources/images/course-placeholder.png'
    }

    if (isNil(sensei.profileImgUrl)) {
      return '/resources/images/avatars/master.png'
    }
    return sensei.profileImgUrl
  }

  const getCourseCard = () => {
    if (currLocation === 'CartDropdown') {
      return dropdownCourseCard()
    }

    return courseCard()
  }

  const GenericCard = ({
    redirectToProductPage,
    imgSrc,
    title,
    senseiName,
    subTitle,
    priceWithUnits,
    isDeleteBtnNeeded,
    removeHandler,
    passQty,
    isMentorshipBilling,
  }) => {
    return (
      <div
        role="button"
        tabIndex={0}
        className="btn border-0 text-left w-100 mt-4"
        onClick={redirectToProductPage}
        onKeyDown={event => event.preventDefault()}
      >
        <div className="row align-items-center">
          <div className="col-auto pl-2">
            <Avatar size={64} src={imgSrc} />
          </div>
          <div className="col pl-2">
            <h5 className="truncate-2-overflow text-wrap font-weight-bold">{title}</h5>
            <span className="mb-2 h6 text-dark text-uppercase text-wrap">{senseiName}</span>
            <div className="truncate-2-overflow text-wrap text-muted">{subTitle}</div>
            {!!passQty && <div className="text-dark text-wrap">{`Pass Quantity: ${passQty}`}</div>}
            <div className="text-dark text-wrap mt-2">
              <span>
                <strong>
                  {isMentorshipBilling && 'Price per Pass: '}
                  {priceWithUnits}
                </strong>
              </span>
            </div>
          </div>

          {isDeleteBtnNeeded ? (
            <div className="col-2">
              <Button block danger onClick={removeHandler}>
                <DeleteOutlined />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    )
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
      <GenericCard
        redirectToProductPage={() => redirect(listing.courseId)}
        imgSrc={
          listing.imgUrl ? `${listing.imgUrl}?${new Date().getTime()}` : GetDefaultProfilePic()
        }
        title={listing.title}
        senseiName={getUserFullName(sensei)}
        subTitle={listing.subTitle}
        priceWithUnits={`$ ${parseFloat(listing.priceAmount).toFixed(2)}`}
        isDeleteBtnNeeded={needButton}
        removeHandler={removeClick}
      />
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
              src={sensei.profileImgUrl ? sensei.profileImgUrl : GetDefaultProfilePic()}
            />
          </div>
          <div className="col pl-0">
            <h6 className="truncate-2-overflow text-wrap">
              {!isNil(sensei.firstName) ? sensei.firstName : 'Anonymous'}{' '}
              {!isNil(sensei.lastName) ? sensei.lastName : 'Pigeon'}
            </h6>
            <div className="text-dark text-wrap">{listing.name}</div>
            <div className="text-dark text-wrap">
              Pass Quantity: {listing.CartToMentorshipListing.numSlots}
            </div>
            <div className="text-dark text-wrap mt-2">
              <span>
                <strong>
                  ${' '}
                  {parseFloat(
                    listing.priceAmount * listing.CartToMentorshipListing.numSlots,
                  ).toFixed(2)}
                </strong>
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

    const getPrice = () => {
      if (isBilling) {
        return listing.priceAmount
      }
      return listing.priceAmount * listing.CartToMentorshipListing.numSlots
    }

    const getPassQty = () => {
      if (!isBilling) {
        return listing.CartToMentorshipListing.numSlots
      }
      return null
    }

    return (
      <GenericCard
        redirectToProductPage={() => redirect(listing.mentorshipListingId)}
        imgSrc={sensei.profileImgUrl ? sensei.profileImgUrl : GetDefaultProfilePic()}
        title={listing.name}
        senseiName={getUserFullName(sensei)}
        subTitle={listing.description}
        priceWithUnits={`$ ${parseFloat(getPrice()).toFixed(2)}`}
        isDeleteBtnNeeded={needButton}
        removeHandler={removeClick}
        passQty={getPassQty()}
        isMentorshipBilling={isBilling}
      />
    )
  }

  return <div>{isCourse ? getCourseCard() : getMentorshipCard()}</div>
}

export default ProductCard
