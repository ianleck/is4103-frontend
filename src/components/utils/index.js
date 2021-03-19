import { notification, message } from 'antd'
import { isNil } from 'lodash'
import moment from 'moment'

export const formatTime = dateTime => {
  return moment(dateTime).format('DD MMM YYYY h:mm:ss a')
}

export const sortArrByCreatedAtAsc = objArr => {
  return objArr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export const resetUser = {
  accountId: '',
  adminVerified: '',
  bio: '',
  chatPrivacy: '',
  contactNumber: '',
  createdAt: '',
  cvUrl: '',
  deletedAt: '',
  email: '',
  emailNotification: '',
  emailVerified: '',
  Experience: [],
  firstName: '',
  headline: '',
  industry: '',
  isPrivateProfile: '',
  lastName: '',
  occupation: '',
  paypalId: '',
  role: '',
  personality: '',
  profileImgUrl: '',
  status: '',
  transcriptUrl: '',
  updatedAt: '',
  userType: '',
  username: '',
  walletId: '',
  // Local Attributes
  accessToken: '',
  authorized: false,
  loading: false,
  requiresProfileUpdate: false,
}

export const createUserObj = (currentUser, isAuthorized, isLoading, isProfileUpdateRqd) => {
  return {
    accountId: currentUser.accountId,
    adminVerified: currentUser.adminVerified,
    bio: currentUser.bio,
    chatPrivacy: currentUser.chatPrivacy,
    contactNumber: currentUser.contactNumber,
    createdAt: currentUser.createdAt,
    cvUrl: currentUser.cvUrl,
    deletedAt: currentUser.deletedAt,
    email: currentUser.email,
    emailNotification: currentUser.emailNotification,
    emailVerified: currentUser.emailVerified,
    Experience: isNil(currentUser.Experience) ? [] : currentUser.Experience,
    firstName: currentUser.firstName,
    headline: currentUser.headline,
    industry: currentUser.industry,
    isPrivateProfile: currentUser.isPrivateProfile,
    lastName: currentUser.lastName,
    occupation: currentUser.occupation,
    paypalId: currentUser.paypalId,
    personality: currentUser.personality,
    profileImgUrl: currentUser.profileImgUrl,
    status: currentUser.status,
    transcriptUrl: currentUser.transcriptUrl,
    updatedAt: currentUser.updatedAt,
    userType: currentUser.userType,
    username: currentUser.username,
    walletId: currentUser.walletId,
    // Local Attributes
    accessToken: currentUser.accessToken,
    authorized: isAuthorized,
    loading: isLoading,
    requiresProfileUpdate: isProfileUpdateRqd,
  }
}

export const createAdminObj = (currentAdmin, isAuthorized, isLoading) => {
  return {
    accountId: currentAdmin.accountId,
    contactNumber: currentAdmin.contactNumber,
    createdAt: currentAdmin.createdAt,
    deletedAt: currentAdmin.deletedAt,
    email: currentAdmin.email,
    emailVerified: currentAdmin.emailVerified,
    firstName: currentAdmin.firstName,
    lastName: currentAdmin.lastName,
    paypalId: currentAdmin.paypalId,
    role: currentAdmin.role,
    userType: currentAdmin.userType,
    username: currentAdmin.username,
    walletId: currentAdmin.walletId,
    // Local Attributes
    accessToken: currentAdmin.accessToken,
    authorized: isAuthorized,
    loading: isLoading,
  }
}

export const showNotification = (type, msg, description) => {
  switch (type) {
    case 'success':
      notification.success({
        msg,
        description,
      })
      break
    case 'error':
      notification.error({
        msg,
        description,
      })
      break
    case 'warn':
      notification.warn({
        msg,
        description,
      })
      break
    default:
      break
  }
}

export const showMessage = (type, msg) => {
  switch (type) {
    case 'success':
      message.success(msg)
      break
    case 'error':
      message.error(msg)
      break
    case 'warning':
      message.warning(msg)
      break
    default:
      break
  }
}
