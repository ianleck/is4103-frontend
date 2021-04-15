export const ADMIN_ROLE_ENUM = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  FINANCE: 'FINANCE',
}

export const ADMIN_VERIFIED_ENUM = {
  SHELL: 'SHELL',
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  DRAFT: 'DRAFT',
}

export const BACKEND_API = 'https://a222350f2af1.ngrok.io/api'
export const SOCKET_API = 'wss://a222350f2af1.ngrok.io'
// export const BACKEND_API = 'http://localhost:5000/api'
export const FRONTEND_API = 'http://localhost:3000'

export const DEFAULT_TIMEOUT = 550

export const DEFAULT_ITEMS_PER_PAGE = 10

export const MENTORSHIP_CONTRACT_APPROVAL = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}

export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const LEVEL_ENUM = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
}

export const PRIVACY_PERMISSIONS_ENUM = {
  FOLLOWING_ONLY: 'FOLLOWING_ONLY',
  ALL: 'ALL',
  NONE: 'NONE',
}

export const STATUS_ENUM = {
  ACTIVE: 'ACTIVE',
  BANNED: 'BANNED',
}

export const USER_TYPE_ENUM = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  SENSEI: 'SENSEI',
}

export const USER_TYPE_STRING = {
  ADMIN: 'Admin',
  STUDENT: 'Student',
  SENSEI: 'Sensei',
}

export const VISIBILITY_ENUM = {
  PUBLISHED: 'PUBLISHED',
  HIDDEN: 'HIDDEN',
}

export const CONTRACT_PROGRESS_ENUM = {
  NOT_STARTED: 'NOT_STARTED',
  ONGOING: 'ONGOING',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
}

export const BILLING_TYPE = {
  INTERNAL: 'INTERNAL',
  COURSE: 'COURSE',
  MENTORSHIP: 'MENTORSHIP',
  REFUND: 'REFUND',
  WITHDRAWAL: 'WITHDRAWAL',
}

export const BILLING_STATUS_ENUM = {
  ADMIN: 'ADMIN',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED',
  PENDING_120_DAYS: 'PENDING_120_DAYS',
  PENDING_WITHDRAWAL: 'PENDING_WITHDRAWAL',
  REJECTED: 'REJECTED',
  PAID: 'PAID',
  WITHDRAWN: 'WITHDRAWN',
}

export const DIRECTION = {
  ASC: 'ASCENDING',
  DESC: 'DESCENDING',
}

export const FOLLOWING_ENUM = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  BLOCKED: 'BLOCKED',
  UNBLOCKED: 'UNBLOCKED',
}

export const TASK_PROGRESS = {
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
}

export const SOCIAL_ACTIONS = {
  FOLLOW: 'FOLLOW',
  UNFOLLOW: 'UNFOLLOW',
  CANCEL_FOLLOW_REQUEST: 'CANCEL_FOLLOW_REQUEST',
  ACCEPT_FOLLOW_REQUEST: 'ACCEPT_FOLLOW_REQUEST',
  REJECT_FOLLOW_REQUEST: 'REJECT_FOLLOW_REQUEST',
}
