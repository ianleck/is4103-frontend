import React, { useEffect, useState } from 'react'
import * as jwtAdmin from 'services/jwt/admin'

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
        if (response[i].adminVerified === 'PENDING' || response[i].adminVerified === 'SHELL') {
          counter += 1
        }
      }
    }
    setCount(counter)
  }

  return (
    <div className="card">
      <div className="card-body bg-warning">
        <h4 className="d-flex align-items-center justify-content-center text-white ">{count}</h4>
        <h6 className="d-flex align-items-center justify-content-center text-white">
          Unverified Senseis
        </h6>
      </div>
    </div>
  )
}

export default UnverifiedWidget
