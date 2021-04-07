import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import * as jwtCart from 'services/cart'
import { Button, notification } from 'antd'
import { LoadingOutlined, ShoppingOutlined } from '@ant-design/icons'
import { CART_EMPTY, WARNING } from 'constants/notifications'
import { size } from 'lodash'

const CheckoutCard = () => {
  const cart = useSelector(state => state.cart)
  const isEmptyCart = size(cart.Courses) === 0 && size(cart.MentorPasses) === 0
  const [isLoading, setIsLoading] = useState(false)

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
      const response = await jwtCart.checkOut(cart.cartId)
      window.location = response.paypalUrl
    }
  }

  const getCourseTotal = () => {
    let amt = 0

    if (!isEmptyCart) {
      for (let i = 0; i < cart.Courses.length; i += 1) {
        amt += cart.Courses[i].priceAmount
      }
    }
    return amt
  }

  const getMentorshipTotal = () => {
    let amt = 0

    if (!isEmptyCart) {
      for (let i = 0; i < cart.MentorPasses.length; i += 1) {
        amt +=
          cart.MentorPasses[i].priceAmount * cart.MentorPasses[i].CartToMentorshipListing.numSlots
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
