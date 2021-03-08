import React, { useEffect, useState } from 'react'
import CountIconWidget from 'components/Common/CountIconWidget'
import { isNil } from 'lodash'
import * as jwtAdmin from 'services/jwt/admin'

const StudentWidget = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    populateStudent()
  }, [])

  const populateStudent = async () => {
    // change endpoint
    const response = await jwtAdmin.getAllStudents()
    let counter = 0

    if (response.length > 0) {
      for (let i = 0; i < response.length; i += 1) {
        if (!isNil(response[i].userType)) {
          if (response[i].userType === 'STUDENT') {
            counter += 1
          }
        }
      }
    }
    setCount(counter)
  }

  return (
    <CountIconWidget
      title="Total Student Accounts"
      count={count}
      icon={<i className="fe fe-user" />}
    />
  )
}

export default StudentWidget
