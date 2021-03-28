import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Dropdown, Button } from 'antd'
import { map, size } from 'lodash'
import styles from './style.module.scss'
import ProductCard from '../ProductCard'

const Cart = () => {
  const history = useHistory()
  const cart = useSelector(state => state.cart)
  const isEmptyCart = size(cart.Course) === 0 && size(cart.MentorshipApplications) === 0

  const cartItems = () => {
    return isEmptyCart ? (
      <div>
        <div className="card-body d-flex font-size-18 justify-content-center">
          <div>No items in cart</div>
        </div>
      </div>
    ) : (
      <div>
        <div className="mt-2">{cart.Course.length !== 0 && courseItems()}</div>
        <div className="mt-2">{cart.MentorshipApplications.length !== 0 && mentorshipItems()}</div>
      </div>
    )
  }

  const courseItems = () => {
    return (
      <div className="row">
        <div className="col-12 font-weight-bold">Course(s)</div>
        <div className="col-12 mt-2">
          {map(cart.Course, c => (
            <ProductCard listing={c} location="CartDropdown" key={c.courseId} />
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
          {map(cart.MentorshipApplications, m => (
            <ProductCard listing={m} location="CartDropdown" key={m.mentorshipListingId} />
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
        <i className={`${styles.icon} fe fe-shopping-cart`} />
      </div>
    </Dropdown>
  )
}

export default Cart