import React, { useEffect, useState } from 'react'
import * as jwtAdmin from 'services/jwt/admin'

const BannedWidget = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    populateBanned()
  }, [])

  const populateBanned = async () => {
    // change endpoint
    const response1 = await jwtAdmin.getAllStudents()
    const response2 = await jwtAdmin.getAllSenseis()
    let counter = 0

    if (response1.length > 0) {
      for (let i = 0; i < response1.length; i += 1) {
        // console.log(response[i])
        if (response1[i].status === 'DEACTIVATED') {
          counter += 1
        }
      }
    }
    if (response2.length > 0) {
      for (let i = 0; i < response2.length; i += 1) {
        // console.log(response[i])
        if (response2[i].status === 'DEACTIVATED') {
          counter += 1
        }
      }
    }

    setCount(counter)
  }

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="d-flex align-items-center justify-content-center">{count}</h4>
        <h6 className="d-flex align-items-center justify-content-center">
          Number of Banned Accounts
        </h6>
      </div>
    </div>
  )
}

export default BannedWidget
