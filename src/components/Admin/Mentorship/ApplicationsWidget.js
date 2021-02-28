import React, { useEffect, useState } from 'react'
import * as jwtAdmin from 'services/jwt/admin'

const ApplicationsWidget = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    populateApplications()
  }, [])

  const populateApplications = async () => {
    // Update this end point
    const response = await jwtAdmin.getAllMentorshipContracts()
    setCount(response.length)
  }

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="d-flex align-items-center justify-content-center">{count}</h4>
        <h6 className="d-flex align-items-center justify-content-center">
          Number of Mentorship Applications (Needs Update)
        </h6>
      </div>
    </div>
  )
}

export default ApplicationsWidget
