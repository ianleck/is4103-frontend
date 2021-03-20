import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as jwtCart from 'services/jwt/cart'
import { LoadingOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import ProductCard from 'components/Cart/ProductCard'

const Success = () => {
  const location = useLocation()
  const paymentId = new URLSearchParams(location.search).get('paymentId')
  const token = new URLSearchParams(location.search).get('token')
  const payerID = new URLSearchParams(location.search).get('PayerID')

  const user = useSelector(state => state.user)
  const [cart, setCart] = useState()
  const [isEmptyCart, setIsEmptyCart] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useDispatch()

  useEffect(() => {
    const populateCart = async () => {
      if (user.accountId !== '') {
        const response = await jwtCart.getCart()
        setCart(response.cart)

        if (
          (isEmpty(response.cart.Course) && isEmpty(response.cart.MentorshipApplications)) ||
          (response.cart.Course.length === 0 && response.cart.MentorshipApplications.length === 0)
        ) {
          setIsEmptyCart(true)
        } else {
          setIsEmptyCart(false)
        }
      }
    }

    const updateBackend = async () => {
      const response = await jwtCart.capturePayment(paymentId, token, payerID)
      if (response) {
        setIsLoading(false)
      }
    }

    populateCart()
    updateBackend()
  }, [user, paymentId, token, payerID])

  const getSubTotal = () => {
    let amt = 0

    if (!isEmptyCart) {
      for (let i = 0; i < cart.Course.length; i += 1) {
        amt += cart.Course[i].priceAmount
      }

      for (let i = 0; i < cart.MentorshipApplications.length; i += 1) {
        amt += cart.MentorshipApplications[i].priceAmount
      }
    }
    return amt
  }

  const cartSubTotal = () => {
    return (
      <div className="d-flex flex-row justify-content-end">
        <div>$ {parseFloat(getSubTotal()).toFixed(2)}</div>
      </div>
    )
  }

  const itemList = () => {
    return (
      <div>
        <div className="card-header">Item(s) Checked out:</div>

        <div className="card-body">{getItemList()}</div>
      </div>
    )
  }

  const getItemList = () => {
    if (isEmptyCart) {
      return (
        <div className="row">
          <div className="mt-2">
            <LoadingOutlined spin />
          </div>
        </div>
      )
    }

    const courses = cart.Course
    const mentorships = cart.MentorshipApplications

    emptyCart(courses, mentorships)

    return (
      <div className="col-12">
        <div className="row">
          <div className="w-100">
            {courses.map(c => (
              <ProductCard location="SuccessPage" listing={c} key={c.courseId} />
            ))}
          </div>
        </div>

        <div className="row mt-2">
          <div className="w-100">
            {mentorships.map(m => (
              <ProductCard location="SuccessPage" listing={m} key={m.mentorshipListingId} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const emptyCart = async (courses, mentorships) => {
    let courseIds = []
    let mentorshipListingIds = []

    for (let i = 0; i < courses.length; i += 1) {
      courseIds = [...courseIds, courses[i].courseId]
    }

    for (let i = 0; i < mentorships.length; i += 1) {
      mentorshipListingIds = [...mentorshipListingIds, mentorships[i].mentorshipListingId]
    }

    dispatch({
      type: 'cart/EMPTY_CART',
      payload: { courseIds, mentorshipListingIds },
    })
  }

  const transactionDetails = () => {
    return (
      <div>
        <div className="card-header">
          <div className="font-size-24">Transaction Successful</div>
        </div>

        <div className="card-body">
          <div>Payment ID: {paymentId}</div>
          <div>Payer ID: {payerID}</div>
        </div>

        <div className="card-body">{itemList()}</div>

        <div className="card-body bg-gray-1 border-top">
          <div className="row justify-content-between">
            <div className="col-7 ">Amount paid</div>
            <div className="col-5 ">{cartSubTotal()}</div>
          </div>
        </div>
      </div>
    )
  }

  const loadingPage = () => {
    return (
      <div>
        <div className="card-body d-flex justify-content-center">
          <LoadingOutlined spin />
        </div>
      </div>
    )
  }

  return <div className="card">{isLoading ? loadingPage() : transactionDetails()}</div>
}

export default Success
