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

export async function getAllStudents() {
  return apiClient
    .get(`/user/student`, { withCredentials: true })
    .then(response => {
      // console.log(response)
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data.admins
      }
      return false
    })
    .catch(err => console.log(err))
}
