import apiClient from 'services/axios'
import { isNil } from 'lodash'

export async function postComplaintReason(complaintReason) {
  return apiClient
    .post(`/complaint/reason/`, { complaintReason }, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getComplaintReasons() {
  return apiClient
    .get(`/complaint/reason`, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.reasons
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function postCommentComplaint(commentId, complaint) {
  return apiClient
    .post(`/complaint/comment/${commentId}`, { complaint }, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function markComplaintAsResolved(complaintId) {
  return apiClient
    .put(`/complaint/${complaintId}`, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getAllComplaints() {
  return apiClient
    .get(`/complaint/`, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
