import React from 'react'
import { Helmet } from 'react-helmet'
import Register from 'components/Sensei/Auth/Register'

const SenseiRegister = () => {
  return (
    <div>
      <Helmet title="Register" />
      <Register />
    </div>
  )
}

export default SenseiRegister
