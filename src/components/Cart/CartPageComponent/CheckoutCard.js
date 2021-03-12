import React from 'react'
import { Button } from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'

const CheckoutCard = () => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="font-size-24">TOTAL</div>
      </div>

      <div className="card-body mt-3">
        <div className="row justify-content-between">
          <div className="col-7 ">Sub-total</div>
          <div className="col-5 ">$123</div>
        </div>
      </div>

      <div className="card-body">
        <Button block size="large" className="bg-success text-white">
          <ShoppingOutlined /> Check out
        </Button>
      </div>

      <div className="card-body">
        <div>WE ACCEPT:</div>
        <div>
          <img src="/resources/images/paypal-logo.png" alt="Paypal" width="60" />
        </div>
      </div>
    </div>
  )
}

export default CheckoutCard
