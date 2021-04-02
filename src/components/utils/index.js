import { InfoCircleOutlined } from '@ant-design/icons'
import { notification, message, Button } from 'antd'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_TIMEOUT, DIRECTION } from 'constants/constants'
import { isNil, map, size } from 'lodash'
import moment from 'moment'
import React from 'react'

export const formatTime = dateTime => {
  return moment(dateTime).format('DD MMM YYYY h:mm:ss a')
}

export const sortArrByCreatedAt = (objArr, direction) => {
  if (direction === DIRECTION.ASC) {
    return objArr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }
  // for descending
  return objArr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const sortDescAndKeyAccId = data => {
  return map(sortArrByCreatedAt(data, DIRECTION.DESC), user => ({
    ...user,
    key: user.accountId,
  }))
}

export const sortDescAndKeyCourseId = data => {
  return map(sortArrByCreatedAt(data, DIRECTION.DESC), user => ({
    ...user,
    key: user.courseId,
  }))
}

export const sortDescAndKeyBillingId = data => {
  return map(sortArrByCreatedAt(data, DIRECTION.DESC), billing => ({
    ...billing,
    key: billing.billingId,
  }))
}

export const sortDescAndKeyCommentId = data => {
  return map(sortArrByCreatedAt(data, DIRECTION.DESC), comment => ({
    ...comment,
    key: comment.commentId,
  }))
}

export const sortDescAndKeyFollowingId = data => {
  return map(sortArrByCreatedAt(data, DIRECTION.DESC), following => ({
    ...following,
    key: following.followingId,
  }))
}

export const filterDataByAdminVerified = (data, adminVerified) => {
  if (!isNil(adminVerified)) {
    return data.filter(o => {
      return o.adminVerified === adminVerified
    })
  }
  return data
}

export const filterDataByComplaintStatus = (data, complaintStatus) => {
  if (!isNil(complaintStatus)) {
    return data.filter(o => {
      return o.isResolved === complaintStatus
    })
  }
  return data
}

export const filterDataByFollowingStatus = (data, followingStatus) => {
  if (!isNil(followingStatus)) {
    return data.filter(o => {
      return o.followingStatus === followingStatus
    })
  }
  return data
}

export const sortDescAndKeyComplaintId = data => {
  return map(
    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    complaint => ({
      ...complaint,
      key: complaint.complaintId,
    }),
  )
}

export const resetCart = {
  createdAt: '',
  updatedAt: '',
  cartId: '',
  studentId: '',
  deletedAt: null,
  Course: [],
  MentorshipApplications: [],
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
        message: msg,
        description,
        duration: 2.5,
      })
      break
    case 'error':
      notification.error({
        message: msg,
        description,
        duration: 2.5,
      })
      break
    case 'warn':
      notification.warn({
        message: msg,
        description,
        duration: 2.5,
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

export const getDetailsColumn = viewItem => {
  return {
    title: 'Details',
    key: 'details',
    width: '10%',
    render: record => (
      <Button
        type="primary"
        shape="round"
        onClick={() => viewItem(record)}
        icon={<InfoCircleOutlined />}
      />
    ),
  }
}

export const sendToSocialProfile = (history, accountId) => {
  history.push(`/social/profile/${accountId}`)
}

export const initPageItems = (
  setIsLoading,
  totalData,
  setPaginatedItems,
  setCurrentPageIdx,
  setShowLoadMore,
) => {
  const tempPaginatedItems = []
  for (
    let i = 0;
    i < (DEFAULT_ITEMS_PER_PAGE < size(totalData) ? DEFAULT_ITEMS_PER_PAGE : size(totalData));
    i += 1
  ) {
    tempPaginatedItems.push(totalData[i])
  }
  setPaginatedItems(tempPaginatedItems)
  setCurrentPageIdx(1)
  if (DEFAULT_ITEMS_PER_PAGE < size(totalData)) {
    setShowLoadMore(true)
  } else {
    setShowLoadMore(false)
  }
  setTimeout(() => {
    setIsLoading(false)
  }, DEFAULT_TIMEOUT)
}
