import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as jwtCart from 'services/jwt/cart'
import { Button, notification } from 'antd'
import { LoadingOutlined, ShoppingOutlined } from '@ant-design/icons'
import { CART_EMPTY, WARNING } from 'constants/notifications'
import { isEmpty } from 'lodash'

const CheckoutCard = () => {
  const user = useSelector(state => state.user)
  const [cart, setCart] = useState()
  const [isEmptyCart, setIsEmptyCart] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

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
    populateCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getSubTotal = () => {
    const amt = 0

    if (!isEmptyCart) {
      return getCourseTotal() + getMentorshipTotal()
    }
    return amt
  }

  const doCheckout = async () => {
    if (isEmptyCart) {
      notification.warning({
        message: WARNING,
        description: CART_EMPTY,
      })
    } else {
      setIsLoading(true)
      let courseIds = []
      let mentorshipListingIds = []

      for (let i = 0; i < cart.Course.length; i += 1) {
        courseIds = [...courseIds, cart.Course[i].courseId]
      }

      for (let i = 0; i < cart.MentorshipApplications.length; i += 1) {
        mentorshipListingIds = [
          ...mentorshipListingIds,
          cart.MentorshipApplications[i].mentorshipListingId,
        ]
      }

      const response = await jwtCart.checkOut(courseIds, mentorshipListingIds)
      setIsLoading(false)
      window.location = response.paypalUrl
    }
  }

  const getCourseTotal = () => {
    let amt = 0

    if (!isEmptyCart) {
      for (let i = 0; i < cart.Course.length; i += 1) {
        amt += cart.Course[i].priceAmount
      }
    }
    return amt
  }

  const getMentorshipTotal = () => {
    let amt = 0

    if (!isEmptyCart) {
      for (let i = 0; i < cart.MentorshipApplications.length; i += 1) {
        amt += cart.MentorshipApplications[i].priceAmount
      }
    }
    return amt
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="font-size-24">TOTAL</div>
      </div>

      <div className="card-body">
        <div className="row justify-content-between mt-3">
          <div className="col-7">Course Total</div>
          <div className="col-5 d-flex flex-row justify-content-end">
            $ {parseFloat(getCourseTotal()).toFixed(2)}
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-7">Mentorship Total</div>
          <div className="col-5 d-flex flex-row justify-content-end">
            $ {parseFloat(getMentorshipTotal()).toFixed(2)}
          </div>
        </div>
        <hr />
        <div className="row justify-content-between mt-3">
          <div className="col-7 font-weight-bold">Sub-total</div>
          <div className="col-5 d-flex flex-row justify-content-end">
            $ {parseFloat(getSubTotal()).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="card-body">
        <Button block size="large" className="bg-success text-white" onClick={() => doCheckout()}>
          {isLoading ? <LoadingOutlined spin /> : <ShoppingOutlined />} Checkout
        </Button>
      </div>

      <div className="card-body">
        <div>WE ACCEPT:</div>
        <div>
          <img src="/resources/images/paypal-logo.png" alt="Paypal" width="60" />
        </div>
      </div>
    </div>
  )
}

export default CheckoutCard
