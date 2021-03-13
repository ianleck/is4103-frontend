import React from 'react'
import { ShoppingCartOutlined } from '@ant-design/icons'

const CartItemList = () => {
  const isEmpty = false

  const itemsList = () => {
    return (
      <div>
        <div>
          <div className="card-header">Mentorship</div>
          <div className="card-body">
            <div>Item 1</div>
            <div>Item 2</div>
            <div>Item 3</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="card-header">Courses</div>
          <div className="card-body">
            <div>Item 1</div>
            <div>Item 2</div>
            <div>Item 3</div>
          </div>
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
        <div className="row">
          {isEmpty ? (
            <div className="col-12 d-flex justify-content-center mt-5 mb-5">
              <div>
                <ShoppingCartOutlined /> No Items in Cart
              </div>
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
