import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as jwtCart from 'services/jwt/cart'
import { Button, notification } from 'antd'
import { LoadingOutlined, ShoppingOutlined } from '@ant-design/icons'
import { WARNING } from 'constants/notifications'

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
          (response.cart.Course === undefined &&
            response.cart.MentorshipApplications === undefined) ||
          (response.cart.Course.length === 0 && response.cart.MentorshipApplications.length === 0)
        ) {
          setIsEmptyCart(true)
        } else {
          setIsEmptyCart(false)
        }
      }
    }
    populateCart()
  }, [user, cart])

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
        <div>$ {getSubTotal()}</div>
      </div>
    )
  }

  const doCheckout = async () => {
    if (isEmptyCart) {
      notification.warning({
        message: WARNING,
        description: 'You cannot checkout an empty cart.',
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
      window.open(response.paypalUrl, '_blank')
      console.log(response)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="font-size-24">TOTAL</div>
      </div>

      <div className="card-body mt-3">
        <div className="row justify-content-between">
          <div className="col-7 ">Sub-total</div>
          <div className="col-5 ">{cartSubTotal()}</div>
        </div>
      </div>

      <div className="card-body">
        <Button block size="large" className="bg-success text-white" onClick={() => doCheckout()}>
          {isLoading ? <LoadingOutlined spin /> : <ShoppingOutlined />} Check out
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
