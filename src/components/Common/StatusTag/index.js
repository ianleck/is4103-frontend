import React from 'react'
import { Tag } from 'antd'
import {
  ADMIN_VERIFIED_ENUM,
  BILLING_STATUS_ENUM,
  CONTRACT_PROGRESS_ENUM,
  MENTORSHIP_CONTRACT_APPROVAL,
  STATUS_ENUM,
  TASK_PROGRESS,
  USER_TYPE_ENUM,
  CONTRACT_TYPES,
  REFUND_STATUS,
} from 'constants/constants'

import { isNil } from 'lodash'
import { NA } from 'constants/text'

// Usage: <StatusTag data={course} type='ADMIN_VERIFIED_ENUM' />
// OR <StatusTag data={{ adminVerified: record }} type='ADMIN_VERIFIED_ENUM' />
// OR <StatusTag data={{ userType: record }} type='USER_TYPE_ENUM' />
const StatusTag = data => {
  const type = !isNil(data.type) ? data.type : ''
  let colour
  if (type === 'ADMIN_VERIFIED_ENUM') {
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
  if (type === 'USER_TYPE_ENUM') {
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

  if (type === 'COMPLAINT_STATUS_ENUM') {
    const dataSource = !isNil(data.data.isResolved) ? data.data.isResolved : data.isResolved
    let text = ''
    switch (dataSource) {
      case false:
        colour = 'red'
        text = 'PENDING'
        break
      case true:
        colour = 'green'
        text = 'RESOLVED'
        break
      default:
        break
    }
    return <Tag color={colour}>{text}</Tag>
  }
  if (type === 'BILLING_STATUS_ENUM') {
    const dataSource = data.data

    switch (dataSource) {
      case BILLING_STATUS_ENUM.ADMIN:
        colour = 'processing'
        break
      case BILLING_STATUS_ENUM.FAILED:
      case BILLING_STATUS_ENUM.REJECTED:
        colour = 'red'
        break
      case BILLING_STATUS_ENUM.PENDING_120_DAYS:
      case BILLING_STATUS_ENUM.PENDING_WITHDRAWAL:
        colour = 'warning'
        break

      case BILLING_STATUS_ENUM.PAID:
      case BILLING_STATUS_ENUM.WITHDRAWN:
      case BILLING_STATUS_ENUM.CONFIRMED:
        colour = 'green'
        break
      default:
        colour = 'default'
        break
    }
    return <Tag color={colour}>{dataSource}</Tag>
  }

  if (type === 'TASK_PROGRESS') {
    const dataSource = data.data

    switch (dataSource) {
      case TASK_PROGRESS.ONGOING:
        colour = 'processing'
        break
      case TASK_PROGRESS.COMPLETED:
        colour = 'success'
        break
      default:
        colour = 'error'
        break
    }
    return (
      <Tag color={colour} style={data.style} className={data.className}>
        {dataSource}
      </Tag>
    )
  }

  if (type === 'STATUS_TYPE_ENUM') {
    const dataSource = data.data

    switch (dataSource) {
      case STATUS_ENUM.ACTIVE:
        colour = 'processing'
        break
      case STATUS_ENUM.BANNED:
        colour = 'error'
        break
      default:
        colour = 'default'
        break
    }
    return <Tag color={colour}>{dataSource}</Tag>
  }
  if (type === 'CONTRACT_PROGRESS_ENUM') {
    const dataSource = data.data
    let text = ''

    switch (dataSource) {
      case CONTRACT_PROGRESS_ENUM.NOT_STARTED:
        colour = 'default'
        text = 'NOT STARTED'
        break
      case CONTRACT_PROGRESS_ENUM.ONGOING:
        colour = 'geekblue'
        text = dataSource
        break
      case CONTRACT_PROGRESS_ENUM.CANCELLED:
        colour = 'error'
        text = dataSource
        break
      case CONTRACT_PROGRESS_ENUM.COMPLETED:
        colour = 'green'
        text = dataSource
        break
      default:
        colour = 'default'
        text = dataSource
        break
    }
    return <Tag color={colour}>{text}</Tag>
  }

  if (type === 'MENTORSHIP_CONTRACT_APPROVAL') {
    const dataSource = data.data

    switch (dataSource) {
      case MENTORSHIP_CONTRACT_APPROVAL.PENDING:
        colour = 'processing'
        break
      case MENTORSHIP_CONTRACT_APPROVAL.APPROVED:
        colour = 'green'
        break
      case MENTORSHIP_CONTRACT_APPROVAL.REJECTED:
        colour = 'error'
        break
      default:
        colour = 'default'
        break
    }
    return <Tag color={colour}>{dataSource}</Tag>
  }

  if (type === 'CONTRACT_TYPE') {
    const dataSource = data.data

    switch (dataSource) {
      case CONTRACT_TYPES.COURSE:
        colour = 'volcano'
        break
      case CONTRACT_TYPES.MENTORSHIP:
        colour = 'purple'
        break
      default:
        colour = 'default'
        break
    }
    return <Tag color={colour}>{dataSource}</Tag>
  }

  if (type === 'REFUND_STATUS') {
    const dataSource = data.data

    switch (dataSource) {
      case REFUND_STATUS.PENDING:
        colour = 'processing'
        break
      case REFUND_STATUS.APPROVED:
        colour = 'green'
        break
      case REFUND_STATUS.REJECTED:
        colour = 'error'
        break
      default:
        colour = 'default'
        break
    }
    return <Tag color={colour}>{dataSource}</Tag>
  }

  return <Tag>{NA}</Tag>
}

export default StatusTag
