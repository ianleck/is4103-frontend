import React, { useEffect, useState } from 'react'
import * as jwtAdmin from 'services/jwt/admin'

const SenseiWidget = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    populateSensei()
  }, [])

  const populateSensei = async () => {
    // change endpoint
    const response = await jwtAdmin.getAllSenseis()
    let counter = 0

    if (response.length > 0) {
      for (let i = 0; i < response.length; i += 1) {
        // console.log(response[i])
        if (response[i].userType === 'SENSEI') {
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
          Number of Sensei Accounts
        </h6>
      </div>
    </div>
  )
}

export default SenseiWidget
