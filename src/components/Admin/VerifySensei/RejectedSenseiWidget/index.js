import React, { useEffect, useState } from 'react'
import CountIconWidget from 'components/Common/CountIconWidget'
import { isNil } from 'lodash'
import * as jwtAdmin from 'services/admin'
import { CloseOutlined } from '@ant-design/icons'

const RejectedSenseiWidget = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    populateSensei()
  }, [])

  const populateSensei = async () => {
    const response = await jwtAdmin.getAllSenseis()
    let counter = 0

    if (response.length > 0) {
      for (let i = 0; i < response.length; i += 1) {
        if (!isNil(response[i].adminVerified)) {
          if (response[i].adminVerified === 'REJECTED') {
            counter += 1
          }
        }
      }
    }
    setCount(counter)
  }

  return (
    <CountIconWidget title="Rejected Senseis" count={count} icon={<CloseOutlined />} color="red" />
  )
}

export default RejectedSenseiWidget