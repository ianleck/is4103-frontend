import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { HomeOutlined, LoadingOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { size } from 'lodash'
import ProductCard from 'components/Cart/ProductCard'
import { Button } from 'antd'

const Failed = () => {
  const location = useLocation()
  const history = useHistory()
  const token = new URLSearchParams(location.search).get('token')

  const cart = useSelector(state => state.cart)
  const isEmptyCart = size(cart.Courses) === 0 && size(cart.MentorPasses) === 0

  const getSubTotal = () => {
    let amt = 0

    if (!isEmptyCart) {
      for (let i = 0; i < cart.Courses.length; i += 1) {
        amt += cart.Courses[i].priceAmount
      }

      for (let i = 0; i < cart.MentorPasses.length; i += 1) {
        amt += cart.MentorPasses[i].priceAmount
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
        <div className="card-header">Item(s) in Cart:</div>

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

    const courses = cart.Courses
    const mentorships = cart.MentorPasses

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

  const onToCart = () => {
    const path = '/cart'
    history.push(path)
  }

  const onToHome = () => {
    const path = '/'
    history.push(path)
  }

  const CartDetails = () => {
    return (
      <div>
        <div className="card-header">
          <div className="font-size-24">Transaction Cancelled or Failed</div>
        </div>

        <div className="row pt-2 justify-content-md-between m-2">
          <div className="col-12 col-md-auto col-lg-auto mt-4 mt-md-0">
            <Button
              type="primary"
              block
              shape="round"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={() => onToCart()}
            >
              Return to Cart
            </Button>
          </div>
          <div className="col-12 col-md-auto col-lg-auto mt-4 mt-md-0 text-center text-md-right">
            <Button
              type="primary"
              block
              shape="round"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => onToHome()}
            >
              Return to Home
            </Button>
          </div>
        </div>

        <div className="card-body">
          <div>Token: {token}</div>
        </div>

        <div className="card-body">
          <div>Your transaction was unsuccessful, please try again later.</div>
        </div>

        <div className="card-body">{itemList()}</div>

        <div className="card-body bg-gray-1 border-top">
          <div className="row justify-content-between">
            <div className="col-7 ">Sub Total</div>
            <div className="col-5 ">{cartSubTotal()}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <CartDetails />
    </div>
  )
}

export default Failed
