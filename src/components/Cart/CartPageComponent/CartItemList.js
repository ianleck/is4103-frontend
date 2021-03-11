import React from 'react'
import { ShoppingCartOutlined } from '@ant-design/icons'

const CartItemList = () => {
  const isEmpty = true

  const itemsList = () => {
    return (
      <div>
        <div>
          <div className="card-header">Mentorship</div>
          <div className="card-body">Item 1</div>
          <div className="card-body">Item 2</div>
          <div className="card-body">Item 3</div>
        </div>
        <div className="mt-3">
          <div className="card-header">Courses</div>
          <div className="card-body">Item 1</div>
          <div className="card-body">Item 2</div>
          <div className="card-body">Item 3</div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="font-size-24">MY CART</div>
      </div>

      <div className="card-body">
        <div className="row justify-content-center">
          {isEmpty ? (
            <div className=" mt-5 mb-5">
              <ShoppingCartOutlined /> No Items in Cart
            </div>
          ) : (
            <div className="col-12">{itemsList()}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartItemList
