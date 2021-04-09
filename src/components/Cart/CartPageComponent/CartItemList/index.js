import React from 'react'
import { useSelector } from 'react-redux'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { size } from 'lodash'
import ProductCard from '../../ProductCard'

const CartItemList = () => {
  const cart = useSelector(state => state.cart)
  const isEmptyCart = size(cart.Courses) === 0 && size(cart.MentorPasses) === 0

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
      <div className="row">
        <div className="col-12">{cart.Courses.length !== 0 && courseItems()}</div>
        <div className="col-12 mt-2">{cart.MentorPasses.length !== 0 && mentorshipItems()}</div>
      </div>
    )
  }

  const courseItems = () => {
    return (
      <div className="row">
        <div className="col-12 font-weight-bold">Course(s)</div>
        <div className="col-12 mt-2">
          {cart.Courses.map(c => (
            <ProductCard listing={c} location="CartPage" key={c.courseId} isCourse />
          ))}
        </div>
      </div>
    )
  }

  const mentorshipItems = () => {
    return (
      <div className="row mt-5">
        <div className="col-12 mt-2 font-weight-bold">Mentorship(s)</div>
        <div className="col-12 mt-2">
          {cart.MentorPasses.map(m => (
            <ProductCard listing={m} location="CartPage" key={m.mentorshipListingId} />
          ))}
        </div>
      </div>
    )
  }

  const getSubTotal = () => {
    let amt = 0

    if (!isEmptyCart) {
      for (let i = 0; i < cart.Courses.length; i += 1) {
        amt += cart.Courses[i].priceAmount
      }

      for (let i = 0; i < cart.MentorPasses.length; i += 1) {
        amt +=
          cart.MentorPasses[i].priceAmount * cart.MentorPasses[i].CartToMentorshipListing.numSlots
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
