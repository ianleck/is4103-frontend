import apiClient from 'services/axios'
import { resetUser, createUserObj, createAdminObj } from 'components/utils'
import { isNil } from 'lodash'

export function getLocalUserData() {
  return isNil(localStorage.getItem('user')) ? resetUser : JSON.parse(localStorage.getItem('user'))
}

const setLocalAccessToken = accessToken => {
  localStorage.removeItem('accessToken')
  localStorage.setItem('accessToken', accessToken)
}

const setLocalUserData = (user, accessToken, isAdmin) => {
  if (isAdmin) {
    user = createAdminObj(user, accessToken, true)
  } else {
    user = createUserObj(user, accessToken, true, false)
  }
  localStorage.removeItem('user')
  localStorage.setItem('user', JSON.stringify(user))
}

export function updateLocalUserData(user) {
  localStorage.removeItem('user')
  localStorage.setItem('user', JSON.stringify(user))
  return true
}

export async function login(email, password, isAdmin) {
  const url = isAdmin ? '/admin/login' : '/auth/login'
  return apiClient
    .post(url, {
      email,
      password,
    })
    .then(response => {
      if (response && !isNil(response.data)) {
        const { accessToken, user } = response.data
        if (user && accessToken) {
          user.accessToken = accessToken
          setLocalAccessToken(accessToken)
          setLocalUserData(user, accessToken, isAdmin)
          return user
        }
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function changePassword(oldPassword, newPassword, confirmPassword) {
  return apiClient
    .put('/auth/change-password', {
      oldPassword,
      newPassword,
      confirmPassword,
    })
    .then(response => {
      if (!isNil(response.data)) {
        if (!isNil(response.data.success)) return response.data
      } else {
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function forgetPassword(email) {
  return apiClient
    .post(`/auth/forgot-password/${email}`)
    .then(response => {
      if (!isNil(response.data)) {
        if (!isNil(response.data.success)) return response.data
      } else {
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function resetPassword(resetToken, accountId, newPassword) {
  return apiClient
    .put(`/auth/forgot-password`, {
      resetToken,
      accountId,
      newPassword,
    })
    .then(response => {
      if (!isNil(response.data)) {
        if (!isNil(response.data.success)) return response.data
      } else {
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function register(username, email, password, confirmPassword, isStudent) {
  return apiClient
    .post('/auth/register', {
      newUser: {
        username,
        email,
        password,
        confirmPassword,
        isStudent,
      },
    })
    .then(response => {
      if (response && !isNil(response.data)) {
        const { accessToken, user } = response.data
        if (user && accessToken) {
          user.accessToken = accessToken
          setLocalAccessToken(accessToken)
          setLocalUserData(user, accessToken, false)
          return user
        }
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  return true
}

export async function getProfile(accountId) {
  return apiClient
    .get(`/user/${accountId}`)
    .then(response => {
      if (!isNil(response.data)) {
        if (!isNil(response.data.user)) return response.data.user
      } else {
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updatePersonalInfo(accountId, firstName, lastName, contactNumber) {
  return apiClient
    .put(
      `/user/${accountId}`,
      {
        user: {
          firstName,
          lastName,
          contactNumber,
        },
      },
      { withCredentials: true },
    )
    .then(response => {
      if (!isNil(response.data)) {
        if (!isNil(response.data.user)) return response.data.user
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateAccountSettings(
  accountId,
  isPrivateProfile,
  emailNotification,
  chatPrivacy,
) {
  return apiClient
    .put(
      `/user/${accountId}`,
      {
        user: {
          isPrivateProfile,
          emailNotification,
          chatPrivacy,
        },
      },
      { withCredentials: true },
    )
    .then(response => {
      if (!isNil(response.data)) {
        if (!isNil(response.data.user)) return response.data.user
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateAbout(accountId, updateHeadline, headline, bio) {
  let user = {}
  if (updateHeadline) {
    user = { headline }
  } else {
    user = { bio }
  }
  return apiClient
    .put(
      `/user/${accountId}`,
      {
        user,
      },
      { withCredentials: true },
    )
    .then(response => {
      if (!isNil(response.data)) {
        if (!isNil(response.data.user)) return response.data.user
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateWorkDetails(accountId, isIndustry, industry, occupation) {
  let user = {}
  if (isIndustry) {
    user = { industry }
  } else {
    user = { occupation }
  }
  return apiClient
    .put(
      `/user/${accountId}`,
      {
        user,
      },
      { withCredentials: true },
    )
    .then(response => {
      if (!isNil(response.data)) {
        if (!isNil(response.data.user)) return response.data.user
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updatePersonality(accountId, personality) {
  return apiClient
    .put(
      `/user/${accountId}`,
      {
        user: {
          personality,
        },
      },
      { withCredentials: true },
    )
    .then(response => {
      if (!isNil(response.data)) {
        if (!isNil(response.data.user)) return response.data.user
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateAdminVerified(accountId, adminVerified) {
  return apiClient
    .put(
      `/user/${accountId}`,
      {
        user: {
          adminVerified,
        },
      },
      { withCredentials: true },
    )
    .then(response => {
      console.log(response)
      if (!isNil(response.data)) {
        if (!isNil(response.data.user)) return response.data.user
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function addExperience(
  accountId,
  role,
  dateStart,
  dateEnd,
  description,
  companyName,
  companyUrl,
) {
  return apiClient
    .post(
      `/user/experience/${accountId}`,
      {
        experience: {
          role,
          dateStart,
          dateEnd,
          description,
          companyName,
          companyUrl,
        },
      },
      { withCredentials: true },
    )
    .then(response => {
      if (!isNil(response.data)) {
        if (!isNil(response.data.success)) return response.data
      } else {
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function editExperience(
  accountId,
  experienceId,
  role,
  dateStart,
  dateEnd,
  description,
  companyName,
  companyUrl,
) {
  return apiClient
    .put(
      `/user/experience/${accountId}`,
      {
        experience: {
          experienceId,
          role,
          dateStart,
          dateEnd,
          description,
          companyName,
          companyUrl,
        },
      },
      { withCredentials: true },
    )
    .then(response => {
      if (!isNil(response.data)) {
        if (!isNil(response.data.success)) return response.data
      } else {
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function deleteExperience(accountId, experienceId) {
  return apiClient
    .delete(`/user/experience/${accountId}/${experienceId}`, { withCredentials: true })
    .then(response => {
      if (!isNil(response.data)) {
        if (!isNil(response.data.success)) return response.data
      } else {
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function deleteAccount(accountId) {
  return apiClient
    .delete(`/user/${accountId}`, { withCredentials: true })
    .then(response => {
      if (!isNil(response.data)) {
        if (!isNil(response.data.success)) return response.data.success
      }
      if (response && !isNil(response.data)) {
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}
