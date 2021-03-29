import {
  ADMIN_ROLE_ENUM,
  ADMIN_VERIFIED_ENUM,
  BILLING_STATUS,
  BILLING_TYPE,
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
  { text: BILLING_TYPE.SUBSCRIPTION, value: BILLING_TYPE.SUBSCRIPTION },
  { text: BILLING_TYPE.REFUND, value: BILLING_TYPE.REFUND },
  { text: BILLING_TYPE.WITHDRAWAL, value: BILLING_TYPE.WITHDRAWAL },
]

export const BILLING_STATUS_FILTER = [
  {
    text: BILLING_STATUS.SUCCESS,
    value: BILLING_STATUS.SUCCESS,
  },
  { text: BILLING_STATUS.FAILED, value: BILLING_STATUS.FAILED },
  { text: BILLING_STATUS.PENDING_PAYMENT, value: BILLING_STATUS.PENDING_PAYMENT },
  { text: BILLING_STATUS.PENDING_120_DAYS, value: BILLING_STATUS.PENDING_120_DAYS },
  { text: BILLING_STATUS.PENDING_WITHDRAWAL, value: BILLING_STATUS.PENDING_WITHDRAWAL },
  { text: BILLING_STATUS.CONFIRMED, value: BILLING_STATUS.CONFIRMED },
  { text: BILLING_STATUS.WITHDRAWN, value: BILLING_STATUS.WITHDRAWN },
  { text: BILLING_STATUS.ADMIN, value: BILLING_STATUS.ADMIN },
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

export const CURRENCY_FILTERS = map(currencyCodes, c => ({ value: c.code, text: c.code }))
