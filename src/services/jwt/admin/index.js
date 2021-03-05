import apiClient from 'services/axios'
import { isNil } from 'lodash'

export async function createAdmin(newAdmin) {
  return apiClient
    .post(
      `/admin/register-admin`,
      {
        newAdmin,
      },
      { withCredentials: true },
    )
    .then(response => {
      // console.log(response)
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateAdminProfile(accountId, firstName, lastName, contactNumber) {
  return apiClient
    .put(
      `/admin/${accountId}`,
      {
        admin: {
          firstName,
          lastName,
          contactNumber,
        },
      },
      { withCredentials: true },
    )
    .then(response => {
      // console.log('From jwt')
      // console.log(response)

      if (!isNil(response.data.success)) {
        return response.data.success
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updatePermission(accountId, permission) {
  return apiClient
    .put(
      `/admin/update-permission/${accountId}`,
      {
        admin: {
          permission,
        },
      },
      { withCredentials: true },
    )
    .then(response => {
      // console.log('From jwt')
      // console.log(response)

      if (!isNil(response.data.success)) {
        return response.data.success
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateAdminPassword(accountId, newPassword, confirmPassword) {
  return apiClient
    .put(
      `/admin/reset-admin-password/${accountId}`,
      {
        newPassword,
        confirmPassword,
      },
      { withCredentials: true },
    )
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}

export async function getAdmin(accountId) {
  return apiClient
    .get(`/admin/${accountId}`, { withCredentials: true })
    .then(response => {
      // console.log(response)
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.admin
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getAllAdmins() {
  return apiClient
    .get(`/admin/`, { withCredentials: true })
    .then(response => {
      // console.log(response)
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.admins
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function deleteAdmin(accountId) {
  return apiClient
    .delete(`/admin/${accountId}`, { withCredentials: true })
    .then(response => {
      // console.log(response)
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.success
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function acceptSensei(accountId) {
  return apiClient
    .put(`/admin/accept-sensei/${accountId}`, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.sensei
      }
      return response
    })
    .catch(err => console.log(err))
}

export async function rejectSensei(accountId) {
  return apiClient
    .put(`/admin/reject-sensei/${accountId}`, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.sensei
      }
      return response
    })
    .catch(err => console.log(err))
}

export async function getAllStudents() {
  return apiClient
    .get(`/user/all/student`, { withCredentials: true })
    .then(response => {
      // console.log(response)
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.students
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getAllSenseis() {
  return apiClient
    .get(`/user/all/sensei`, { withCredentials: true })
    .then(response => {
      // console.log(response)
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.senseis
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getSensei(accountId) {
  return apiClient
    .get(`/user/${accountId}`, { withCredentials: true })
    .then(response => {
      // console.log(response)
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.user
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getStudent(accountId) {
  return apiClient
    .get(`/user/${accountId}`, { withCredentials: true })
    .then(response => {
      // console.log(response)
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.user
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getAllMentorshipListings() {
  return apiClient
    .get(`/mentorship/listing/`, { withCredentials: true })
    .then(response => {
      // console.log('Here', response)
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.mentorshipListings
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getMentorMentorshipListings(accountId) {
  return apiClient
    .get(`/mentorship/listing/sensei/${accountId}`, { withCredentials: true })
    .then(response => {
      // console.log(response)
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.mentorshipListings
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getAllMentorshipContracts() {
  return apiClient
    .get(`/mentorship/contract/`, { withCredentials: true })
    .then(response => {
      // console.log('Here', response)
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.mentorshipContracts
      }
      return false
    })
    .catch(err => console.log(err))
}
