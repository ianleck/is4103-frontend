import React from 'react'
import { Helmet } from 'react-helmet'
import CartItemList from '../../components/Cart/CartPageComponent/CartItemList'
import CheckoutCard from '../../components/Cart/CartPageComponent/CheckoutCard'

const cart = () => {
  return (
    <div>
      <Helmet title="Cart" />

      <div className="row">
        <div className="col-12 col-xl-7 font-size-18">
          <CartItemList />
        </div>
        <div className="col-12 col-xl-5 font-size-18">
          <CheckoutCard />
        </div>
      </div>
    </div>
  )
}

export default cart
