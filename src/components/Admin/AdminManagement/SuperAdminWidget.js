import React, { useEffect, useState } from 'react'
import CountIconWidget from 'components/Common/CountIconWidget'
import { SafetyCertificateFilled } from '@ant-design/icons'
import { isNil } from 'lodash'
import * as jwtAdmin from 'services/jwt/admin'

const SuperAdminWidget = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    populateAdmin()
  }, [])

  const populateAdmin = async () => {
    const response = await jwtAdmin.getAllAdmins()
    let counter = 0

    if (response.length > 0) {
      for (let i = 0; i < response.length; i += 1) {
        if (!isNil(response[i].permission)) {
          if (response[i].permission === 'SUPERADMIN') {
            counter += 1
          }
        }
      }
    }
    setCount(counter)
  }

  return (
    <CountIconWidget
      title="Super Admin Accounts"
      count={count}
      icon={<SafetyCertificateFilled />}
    />
  )
}

export default SuperAdminWidget
