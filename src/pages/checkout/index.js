import React from 'react'
import { Helmet } from 'react-helmet'
import Success from 'components/Checkout'

const checkout = () => {
  return (
    <div>
      <Helmet title="Checkout" />

      <div className="row d-flex justify-content-center">
        <div className="col-12 col-xl-8 font-size-18">
          <Success />
        </div>
      </div>
    </div>
  )
}

export default checkout
