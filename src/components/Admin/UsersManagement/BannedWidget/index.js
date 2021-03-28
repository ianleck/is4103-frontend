import React, { useEffect, useState } from 'react'
import CountIconWidget from 'components/Common/CountIconWidget'
import { isNil } from 'lodash'
import * as jwtAdmin from 'services/jwt/admin'

const BannedWidget = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    populateBanned()
  }, [])

  const populateBanned = async () => {
    // change endpoint
    const studentRsp = await jwtAdmin.getAllStudents()
    const senseiRsp = await jwtAdmin.getAllSenseis()
    let counter = 0

    if (studentRsp.length > 0) {
      for (let i = 0; i < studentRsp.length; i += 1) {
        if (!isNil(studentRsp[i].status)) {
          if (studentRsp[i].status === 'DEACTIVATED') {
            counter += 1
          }
        }
      }
    }
    if (senseiRsp.length > 0) {
      for (let i = 0; i < senseiRsp.length; i += 1) {
        if (!isNil(senseiRsp[i].status)) {
          if (senseiRsp[i].status === 'DEACTIVATED') {
            counter += 1
          }
        }
      }
    }

    setCount(counter)
  }

  return (
    <CountIconWidget
      title="Total Banned Accounts"
      count={count}
      icon={<i className="fe fe-slash" />}
    />
  )
}

export default BannedWidget
