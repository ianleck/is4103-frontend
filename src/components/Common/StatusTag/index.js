import React from 'react'
import { Tag } from 'antd'
import { ADMIN_VERIFIED_ENUM } from 'constants/constants'

// Usage: <StatusTag data={course} />
const StatusTag = data => {
  let colour
  switch (data.data.adminVerified) {
    case ADMIN_VERIFIED_ENUM.ACCEPTED:
      colour = 'processing'
      break
    case ADMIN_VERIFIED_ENUM.PENDING:
      colour = 'warning'
      break
    case ADMIN_VERIFIED_ENUM.REJECTED:
      colour = 'error'
      break
    case ADMIN_VERIFIED_ENUM.DRAFT:
      colour = 'default'
      break
    default:
      break
  }
  return <Tag color={colour}>{data.data.adminVerified}</Tag>
}

export default StatusTag
