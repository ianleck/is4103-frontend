import { getAvailableCurrencyCodes } from 'components/utils'
import {
  ADMIN_ROLE_ENUM,
  ADMIN_VERIFIED_ENUM,
  BILLING_STATUS_ENUM,
  BILLING_TYPE,
  CONTRACT_PROGRESS_ENUM,
  MENTORSHIP_CONTRACT_APPROVAL,
  PRIVACY_PERMISSIONS_ENUM,
  STATUS_ENUM,
  USER_TYPE_ENUM,
  VISIBILITY_ENUM,
} from 'constants/constants'
import { currencyCodes } from 'constants/information'
import { map } from 'lodash'

export const BILLING_TYPE_FILTER = [
  {
    text: BILLING_TYPE.INTERNAL,
    value: BILLING_TYPE.INTERNAL,
  },
  { text: BILLING_TYPE.COURSE, value: BILLING_TYPE.COURSE },
  { text: BILLING_TYPE.MENTORSHIP, value: BILLING_TYPE.MENTORSHIP },
  { text: BILLING_TYPE.REFUND, value: BILLING_TYPE.REFUND },
  { text: BILLING_TYPE.WITHDRAWAL, value: BILLING_TYPE.WITHDRAWAL },
]

export const BILLING_STATUS_FILTER = [
  {
    text: BILLING_STATUS_ENUM.PAID,
    value: BILLING_STATUS_ENUM.PAID,
  },
  { text: BILLING_STATUS_ENUM.FAILED, value: BILLING_STATUS_ENUM.FAILED },
  { text: BILLING_STATUS_ENUM.PENDING_120_DAYS, value: BILLING_STATUS_ENUM.PENDING_120_DAYS },
  { text: BILLING_STATUS_ENUM.PENDING_WITHDRAWAL, value: BILLING_STATUS_ENUM.PENDING_WITHDRAWAL },
  { text: BILLING_STATUS_ENUM.CONFIRMED, value: BILLING_STATUS_ENUM.CONFIRMED },
  { text: BILLING_STATUS_ENUM.WITHDRAWN, value: BILLING_STATUS_ENUM.WITHDRAWN },
  { text: BILLING_STATUS_ENUM.ADMIN, value: BILLING_STATUS_ENUM.ADMIN },
]

export const ADMIN_ROLE_ENUM_FILTER = [
  {
    text: ADMIN_ROLE_ENUM.SUPERADMIN,
    value: ADMIN_ROLE_ENUM.SUPERADMIN,
  },
  { text: ADMIN_ROLE_ENUM.ADMIN, value: ADMIN_ROLE_ENUM.ADMIN },
  { text: ADMIN_ROLE_ENUM.FINANCE, value: ADMIN_ROLE_ENUM.FINANCE },
]

export const PRIVACY_PERMISSIONS_ENUM_FILTER = [
  {
    text: PRIVACY_PERMISSIONS_ENUM.FOLLOWING_ONLY,
    value: PRIVACY_PERMISSIONS_ENUM.FOLLOWING_ONLY,
  },
  { text: PRIVACY_PERMISSIONS_ENUM.ALL, value: PRIVACY_PERMISSIONS_ENUM.ALL },
  { text: PRIVACY_PERMISSIONS_ENUM.NONE, value: PRIVACY_PERMISSIONS_ENUM.NONE },
]

export const STATUS_ENUM_FILTER = [
  {
    text: STATUS_ENUM.ACTIVE,
    value: STATUS_ENUM.ACTIVE,
  },
  { text: STATUS_ENUM.BANNED, value: STATUS_ENUM.BANNED },
]

export const ADMIN_VERIFIED_ENUM_FILTER = [
  { text: ADMIN_VERIFIED_ENUM.SHELL, value: ADMIN_VERIFIED_ENUM.SHELL },
  { text: ADMIN_VERIFIED_ENUM.PENDING, value: ADMIN_VERIFIED_ENUM.PENDING },
  { text: ADMIN_VERIFIED_ENUM.ACCEPTED, value: ADMIN_VERIFIED_ENUM.ACCEPTED },
  { text: ADMIN_VERIFIED_ENUM.REJECTED, value: ADMIN_VERIFIED_ENUM.REJECTED },
]

export const VISIBILITY_ENUM_FILTER = [
  {
    text: VISIBILITY_ENUM.PUBLISHED,
    value: VISIBILITY_ENUM.PUBLISHED,
  },
  { text: VISIBILITY_ENUM.HIDDEN, value: VISIBILITY_ENUM.HIDDEN },
]

export const USER_TYPE_ENUM_FILTER = [
  {
    text: USER_TYPE_ENUM.ADMIN,
    value: USER_TYPE_ENUM.ADMIN,
  },
  {
    text: USER_TYPE_ENUM.STUDENT,
    value: USER_TYPE_ENUM.STUDENT,
  },
  {
    text: USER_TYPE_ENUM.SENSEI,
    value: USER_TYPE_ENUM.SENSEI,
  },
]

export const CONTRACT_PROGRESS_ENUM_FILTER = [
  {
    text: CONTRACT_PROGRESS_ENUM.NOT_STARTED,
    value: CONTRACT_PROGRESS_ENUM.NOT_STARTED,
  },
  {
    text: CONTRACT_PROGRESS_ENUM.ONGOING,
    value: CONTRACT_PROGRESS_ENUM.ONGOING,
  },
  {
    text: CONTRACT_PROGRESS_ENUM.CANCELLED,
    value: CONTRACT_PROGRESS_ENUM.CANCELLED,
  },
  {
    text: CONTRACT_PROGRESS_ENUM.COMPLETED,
    value: CONTRACT_PROGRESS_ENUM.COMPLETED,
  },
]

export const MENTORSHIP_CONTRACT_APPROVAL_ENUM_FILTER = [
  {
    text: MENTORSHIP_CONTRACT_APPROVAL.PENDING,
    value: MENTORSHIP_CONTRACT_APPROVAL.PENDING,
  },
  {
    text: MENTORSHIP_CONTRACT_APPROVAL.APPROVED,
    value: MENTORSHIP_CONTRACT_APPROVAL.APPROVED,
  },
  {
    text: MENTORSHIP_CONTRACT_APPROVAL.REJECTED,
    value: MENTORSHIP_CONTRACT_APPROVAL.REJECTED,
  },
]

export const CURRENCY_FILTERS = map(getAvailableCurrencyCodes(currencyCodes), c => ({
  value: c.code,
  text: c.code,
}))
