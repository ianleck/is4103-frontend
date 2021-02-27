import apiClient from 'services/axios'
import { isNil } from 'lodash'

export async function updateAdminProfile(accountId, firstName, lastName) {
  return apiClient
    .put(
      `/admin/${accountId}`,
      {
        admin: {
          firstName,
          lastName,
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
  return apiClient.put(
    `/admin/reset-admin-password/${accountId}`,
    {
      newPassword,
      confirmPassword,
    },
    { withCredentials: true },
  )
}
