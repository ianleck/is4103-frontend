import React, { useEffect, useState } from 'react'
import CountIconWidget from 'components/Common/CountIconWidget'
import { SafetyCertificateOutlined } from '@ant-design/icons'
import { size } from 'lodash'
import * as jwtAdmin from 'services/jwt/admin'

const ActiveAdminWidget = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    populateAdmin()
  }, [])

  const populateAdmin = async () => {
    const response = await jwtAdmin.getAllAdmins()
    if (response && size(response) > 0) {
      setCount(size(response))
    }
  }
  return (
    <CountIconWidget
      title="Total Admin Accounts"
      count={count}
      icon={<SafetyCertificateOutlined />}
    />
  )
}

export default ActiveAdminWidget
