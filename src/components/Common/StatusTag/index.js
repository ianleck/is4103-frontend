import React from 'react'
import { Tag } from 'antd'
import { ADMIN_VERIFIED_ENUM, USER_TYPE_ENUM } from 'constants/constants'

import { isNil } from 'lodash'
import { NA } from 'constants/text'

// Usage: <StatusTag data={course} type={ADMIN_VERIFIED_ENUM.ENUM_NAME} />
// OR <StatusTag data={{ adminVerified: record }} type={ADMIN_VERIFIED_ENUM.ENUM_NAME} />
// OR <StatusTag data={{ userType: record }} type={USER_TYPE_ENUM.ENUM_NAME} />
const StatusTag = data => {
  const type = !isNil(data.type) ? data.type : ''
  let colour
  if (type === ADMIN_VERIFIED_ENUM.ENUM_NAME) {
    const dataSource = !isNil(data.data.adminVerified)
      ? data.data.adminVerified
      : data.adminVerified
    switch (dataSource) {
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
    return <Tag color={colour}>{dataSource}</Tag>
  }
  if (type === USER_TYPE_ENUM.ENUM_NAME) {
    const dataSource = !isNil(data.data.userType) ? data.data.userType : data.userType
    switch (dataSource) {
      case USER_TYPE_ENUM.SENSEI:
        colour = 'purple'
        break
      case USER_TYPE_ENUM.STUDENT:
        colour = 'geekblue'
        break
      case USER_TYPE_ENUM.ADMIN:
        colour = 'magenta'
        break
      default:
        break
    }
    return <Tag color={colour}>{dataSource}</Tag>
  }
  return <Tag>{NA}</Tag>
}

export default StatusTag
