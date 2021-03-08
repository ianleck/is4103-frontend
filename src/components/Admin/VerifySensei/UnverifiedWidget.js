import React, { useEffect, useState } from 'react'
import CountIconWidget from 'components/Common/CountIconWidget'
import { isNil } from 'lodash'
import * as jwtAdmin from 'services/jwt/admin'
import { WarningOutlined } from '@ant-design/icons'

const UnverifiedWidget = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    populateSensei()
  }, [])

  const populateSensei = async () => {
    const response = await jwtAdmin.getAllSenseis()
    let counter = 0

    if (response.length > 0) {
      for (let i = 0; i < response.length; i += 1) {
        if (!isNil(response[i].adminVerified)) {
          if (response[i].adminVerified === 'PENDING' || response[i].adminVerified === 'SHELL') {
            counter += 1
          }
        }
      }
    }
    setCount(counter)
  }

  return (
    <CountIconWidget
      title="Unverified Senseis"
      count={count}
      icon={<WarningOutlined />}
      color="orange"
    />
  )
}

export default UnverifiedWidget
