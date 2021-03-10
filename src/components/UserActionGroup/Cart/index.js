import React from 'react'
import { Dropdown, Button } from 'antd'
import styles from './style.module.scss'

const Cart = () => {
  const cartItems = () => {
    const isItemPresent = false // TO change
    return isItemPresent ? (
      <div>
        <div className="card-body">
          <div className="col-12">Item 1</div>
        </div>
        <div className="card-body border-top">
          <div className="col-12">Item 2</div>
        </div>
        <div className="card-body border-top">
          <div className="col-12">Item 3</div>
        </div>
      </div>
    ) : (
      <div>
        <div className="card-body d-flex font-size-18 justify-content-center">
          <div>No items in cart</div>
        </div>
      </div>
    )
  }

  const cartSubTotal = () => {
    return (
      <div className="d-flex flex-row justify-content-between font-size-18">
        <div>Sub-total</div>
        <div>$120</div>
      </div>
    )
  }

  const menu = (
    <div className="card cui__utils__shadow width-350 border-0">
      <div className="card-header">My Shopping Cart</div>

      <div className="card-body">{cartItems()}</div>

      <div className="card-body bg-gray-1 border-top">{cartSubTotal()}</div>

      <div className="card-body bg-gray-2 border-top">
        <div className="row">
          <div className="col-6">
            <Button block size="large">
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
