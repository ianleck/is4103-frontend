import ChatComponent from 'components/Chat'
import React from 'react'
import { Helmet } from 'react-helmet'

const checkout = () => {
  return (
    <div>
      <Helmet title="Chat" />

      <div>
        <ChatComponent />
      </div>
    </div>
  )
}

export default checkout
