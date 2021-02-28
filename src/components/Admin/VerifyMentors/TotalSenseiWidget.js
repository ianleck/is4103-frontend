import React, { useEffect, useState } from 'react'
import * as jwtAdmin from 'services/jwt/admin'

const TotalSenseiWidget = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    populateSensei()
  }, [])

  const populateSensei = async () => {
    // change endpoint
    const response = await jwtAdmin.getAllSenseis()

    setCount(response.length)
  }

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="d-flex align-items-center justify-content-center">{count}</h4>
        <h6 className="d-flex align-items-center justify-content-center">Total Senseis</h6>
      </div>
    </div>
  )
}

export default TotalSenseiWidget
