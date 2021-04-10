import { BookOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import CountIconWidget from 'components/Common/CountIconWidget'
import { VISIBILITY_ENUM } from 'constants/constants'
import React, { useEffect, useState } from 'react'
import * as jwtAdmin from 'services/admin'

const ListingsWidget = () => {
  const [publishedCount, setPublishedCount] = useState(0)
  const [hiddenCount, setHiddenCount] = useState(0)

  useEffect(() => {
    populateListings()
  }, [])

  const populateListings = async () => {
    let published = 0
    let hidden = 0

    const response = await jwtAdmin.getAllMentorshipListings()

    for (let i = 0; i < response.length; i += 1) {
      if (response[i].visibility === VISIBILITY_ENUM.PUBLISHED) {
        published += 1
      } else {
        hidden += 1
      }
    }

    setPublishedCount(published)
    setHiddenCount(hidden)
  }

  return (
    <div className="row mt-4">
      <div className="col-12 col-md-6">
        <CountIconWidget
          title="Total Published Listings"
          count={publishedCount}
          icon={<BookOutlined />}
        />
      </div>
      <div className="col-12 col-md-6">
        <CountIconWidget
          title="Total Hidden Listings"
          count={hiddenCount}
          icon={<EyeInvisibleOutlined />}
        />
      </div>
    </div>
  )
}

export default ListingsWidget
