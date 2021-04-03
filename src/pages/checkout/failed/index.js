import React from 'react'
import { Helmet } from 'react-helmet'
import Failed from 'components/Checkout/Failed'

const checkout = () => {
  return (
    <div>
      <Helmet title="Checkout" />

      <div className="row justify-content-center">
        <div className="col-12 col-xl-8 font-size-18">
          <Failed />
        </div>
      </div>
    </div>
  )
}

export default checkout
