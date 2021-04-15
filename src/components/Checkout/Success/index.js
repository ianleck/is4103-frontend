import React, { useEffect, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as jwtCart from 'services/cart'
import { FundOutlined, HomeOutlined, LoadingOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import ProductCard from 'components/Common/ProductCard'
import { Button } from 'antd'

const Success = () => {
  const location = useLocation()
  const history = useHistory()
  const paymentId = new URLSearchParams(location.search).get('paymentId')
  const token = new URLSearchParams(location.search).get('token')
  const payerID = new URLSearchParams(location.search).get('PayerID')

  const user = useSelector(state => state.user)
  const [cart, setCart] = useState()
  const [cartId, setCartId] = useState()
  const [isEmptyCart, setIsEmptyCart] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useDispatch()

  useEffect(() => {
    const populateCart = async () => {
      if (user.accountId !== '') {
        const response = await jwtCart.getCart()
        setCart(response.cart)
        setCartId(response.cart.cartId)

        if (
          (isEmpty(response.cart.Courses) && isEmpty(response.cart.MentorPasses)) ||
          (response.cart.Courses.length === 0 && response.cart.MentorPasses.length === 0)
        ) {
          setIsEmptyCart(true)
        } else {
          setIsEmptyCart(false)
        }
      }
    }

    const updateBackend = async () => {
      const response = await jwtCart.capturePayment(paymentId, token, payerID, cartId)
      if (response) {
        setIsLoading(false)
      }
    }

    populateCart()
    if (paymentId && token && payerID && cartId) updateBackend()
  }, [user, paymentId, token, payerID, cartId])

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

    const courses = cart.Courses
    const mentorships = cart.MentorPasses

    emptyCart()

    return (
      <div className="col-12">
        <div className="row">
          <div className="w-100">
            {courses.map(c => (
              <ProductCard location="SuccessPage" listing={c} key={c.courseId} isCourse />
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

  const emptyCart = async () => {
    dispatch({
      type: 'cart/RESET_CART',
    })
  }

  const onToHome = () => {
    const path = '/'
    history.push(path)
  }

  const onToDashboard = () => {
    const path = '/student/dashboard'
    history.push(path)
  }

  const transactionDetails = () => {
    return (
      <div>
        <div className="card-header">
          <div className="font-size-24">Transaction Successful</div>
        </div>

        <div className="row pt-2 justify-content-md-between m-2">
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
          <div className="col-12 col-md-auto col-lg-auto mt-4 mt-md-0">
            <Button
              type="primary"
              block
              shape="round"
              size="large"
              icon={<FundOutlined />}
              onClick={() => onToDashboard()}
            >
              To Dashboard
            </Button>
          </div>
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
