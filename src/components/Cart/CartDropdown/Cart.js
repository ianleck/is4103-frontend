import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as jwtCart from 'services/jwt/cart'
import { Dropdown, Button } from 'antd'
import styles from './style.module.scss'
import MentorshipCard from './MentorshipCard'
import CourseCard from './CourseCard'

const Cart = () => {
  const history = useHistory()
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

  // console.log('cart', cart)

  const cartItems = () => {
    return isEmptyCart ? (
      <div>
        <div className="card-body d-flex font-size-18 justify-content-center">
          <div>No items in cart</div>
        </div>
      </div>
    ) : (
      <div>
        <div className="row">{cart.Course.length !== 0 && courseItems()}</div>
        <div className="row mt-2">
          {cart.MentorshipApplications.length !== 0 && mentorshipItems()}
        </div>
      </div>
    )
  }

  const courseItems = () => {
    return (
      <div className="border-bottom">
        <div className="font-weight-bold">Course(s)</div>
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
      <div>
        <div className="font-weight-bold">Mentorship(s)</div>
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
      <div className="card-header font-weight-bold">My Shopping Cart</div>

      <div className="card-body">{cartItems()}</div>

      <div className="card-body bg-gray-1 border-top">{cartSubTotal()}</div>

      <div className="card-body bg-gray-2 border-top">
        <div className="row">
          <div className="col-6">
            <Button block size="large" onClick={() => goToCart()}>
              View Cart
            </Button>
          </div>
          <div className="col-6">
            <Button block type="primary" size="large">
              Check out
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
