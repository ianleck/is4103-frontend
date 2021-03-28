import React, { useEffect, useState } from 'react'
import CountIconWidget from 'components/Common/CountIconWidget'
import { isNil, size } from 'lodash'
import * as jwtAdmin from 'services/admin'
import { ADMIN_ROLE_ENUM } from 'constants/constants'

const NormalAdminWidget = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    populateAdmin()
  }, [])

  const populateAdmin = async () => {
    const response = await jwtAdmin.getAllAdmins()
    let counter = 0

    if (response && size(response) > 0) {
      for (let i = 0; i < size(response); i += 1) {
        if (response[i] && !isNil(response[i].role)) {
          if (response[i].role === ADMIN_ROLE_ENUM.ADMIN) {
            counter += 1
          }
        }
      }
      setCount(counter)
    }
  }

  return (
    <CountIconWidget title="Admin Accounts" count={count} icon={<i className="fe fe-shield" />} />
  )
}

export default NormalAdminWidget
