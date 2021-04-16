import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Dropdown, Button, Badge } from 'antd'
import { map, size } from 'lodash'
import ProductCard from 'components/Common/ProductCard'
import styles from './style.module.scss'

const Cart = () => {
  const history = useHistory()
  const cart = useSelector(state => state.cart)
  const totalCartItemCount = size(cart.Courses) + size(cart.MentorPasses)
  const isEmptyCart = totalCartItemCount === 0

  const cartItems = () => {
    return isEmptyCart ? (
      <div>
        <div className="card-body d-flex font-size-18 justify-content-center">
          <div>No items in cart</div>
        </div>
      </div>
    ) : (
      <div>
        <div className="mt-2">{cart.Courses.length !== 0 && courseItems()}</div>
        <div className="mt-2">{cart.MentorPasses.length !== 0 && mentorshipItems()}</div>
      </div>
    )
  }

  const courseItems = () => {
    return (
      <div className="row">
        <div className="col-12 font-weight-bold">Course(s)</div>
        <div className="col-12 mt-2">
          {map(cart.Courses, c => (
            <ProductCard listing={c} location="CartDropdown" key={c.courseId} isCourse />
          ))}
        </div>
      </div>
    )
  }

  const mentorshipItems = () => {
    return (
      <div className="row">
        <div className="col-12 mt-2 font-weight-bold">Mentorship(s)</div>
        <div className="col-12 mt-2">
          {map(cart.MentorPasses, m => (
            <ProductCard listing={m} location="CartDropdown" key={m.mentorshipListingId} />
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
    return parseFloat(amt).toFixed(2)
  }

  const cartSubTotal = () => {
    return (
      <div className="d-flex flex-row justify-content-between font-size-18">
        <div>Sub-total</div>
        <div>$ {getSubTotal()}</div>
      </div>
    )
  }

  const goToCart = () => {
    const path = '/cart'
    history.push(path)
  }

  const menu = (
    <div className="card cui__utils__shadow width-350 border-0">
      <div className="card-body">{cartItems()}</div>

      <div className="card-body bg-gray-1 border-top">{cartSubTotal()}</div>

      <div className="card-body border-top">
        <div className="row">
          <div className="col-6">
            <Button block size="large" onClick={() => goToCart()}>
              View Cart
            </Button>
          </div>
          <div className="col-6">
            <Button block className="bg-success text-white" size="large" onClick={() => goToCart()}>
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <div className={styles.dropdown}>
        <Badge count={totalCartItemCount} overflowCount={10} size="small">
          <i className={`${styles.icon} fe fe-shopping-cart`} />
        </Badge>
      </div>
    </Dropdown>
  )
}

export default Cart
