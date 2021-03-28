import React, { useEffect, useState } from 'react'
import * as jwtAdmin from 'services/admin'

const ListingsWidget = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    populateListings()
  }, [])

  const populateListings = async () => {
    const response = await jwtAdmin.getAllMentorshipListings()
    setCount(response.length)
  }

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="d-flex align-items-center justify-content-center">{count}</h4>
        <h6 className="d-flex align-items-center justify-content-center">
          Number of Mentorship Listings
        </h6>
      </div>
    </div>
  )
}

export default ListingsWidget
