import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as jwtCart from 'services/jwt/cart'
import { ShoppingCartOutlined } from '@ant-design/icons'
import CourseCard from './CourseCard'
import MentorshipCard from './MentorshipCard'

const CartItemList = () => {
  const user = useSelector(state => state.user)
  const [cart, setCart] = useState()
  const [isEmptyCart, setIsEmptyCart] = useState(true)

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

  const cartItems = () => {
    return isEmptyCart ? (
      <div className="row">
        <div className="card-body d-flex font-size-18 justify-content-center">
          <div>
            <ShoppingCartOutlined /> No items in cart
          </div>
        </div>
      </div>
    ) : (
      <div className="col-12 ">
        <div className="row">{cart.Course.length !== 0 && courseItems()}</div>
        <div className="row mt-2">
          {cart.MentorshipApplications.length !== 0 && mentorshipItems()}
        </div>
      </div>
    )
  }

  const courseItems = () => {
    return (
      <div className="width-100p">
        <div className="font-weight-bold">
          <div className="col-12">Course(s)</div>
        </div>
        <div className="mt-2">
          {cart.Course.map(c => (
            <CourseCard listing={c} key={c.courseId} />
          ))}
        </div>
      </div>
    )
  }

  const mentorshipItems = () => {
    return (
      <div className="width-100p ">
        <div className="mt-2 font-weight-bold">
          <div className="col-12">Mentorship(s)</div>
        </div>
        <div className="mt-2">
          {cart.MentorshipApplications.map(m => (
            <MentorshipCard listing={m} key={m.mentorshipListingId} />
          ))}
        </div>
      </div>
    )
  }

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
      <div className="d-flex flex-row justify-content-between font-size-18">
        <div>Sub-total</div>
        <div>$ {parseFloat(getSubTotal()).toFixed(2)}</div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="font-size-24">MY CART</div>
      </div>

      <div className="card-body">{cartItems()}</div>
      <div className="card-body bg-gray-1 border-top">{cartSubTotal()}</div>
    </div>
  )
}

export default CartItemList
