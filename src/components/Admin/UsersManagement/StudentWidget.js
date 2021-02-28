import React, { useEffect, useState } from 'react'
import * as jwtAdmin from 'services/jwt/admin'

const StudentWidget = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    populateAdmin()
  }, [])

  const populateAdmin = async () => {
    // change endpoint
    const response = await jwtAdmin.getAllAdmins()
    let counter = 0

    if (response.length > 0) {
      for (let i = 0; i < response.length; i += 1) {
        // console.log(response[i])
        if (response[i].permission === 'ADMIN') {
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
          Number of Student Accounts
        </h6>
      </div>
    </div>
  )
}

export default StudentWidget
