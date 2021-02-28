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
  const url = isAdmin ? '/admin/login' : '/user/login'
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
    .put('/user/change-password', {
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

export async function register(username, email, password, confirmPassword, isStudent) {
  return apiClient
    .post('/user/register', {
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

export async function updateProfile(accountId, firstName, lastName, contactNumber, isStudent) {
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
        if (isStudent && !isNil(response.data.student)) return response.data.student
        if (!isNil(response.data.sensei)) return response.data.sensei
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateAccountSettings(accountId, isStudent, privacy, emailNotification) {
  return apiClient
    .put(
      `/user/${accountId}`,
      {
        user: {
          privacy,
          emailNotification,
        },
      },
      { withCredentials: true },
    )
    .then(response => {
      if (!isNil(response.data)) {
        if (isStudent && !isNil(response.data.student)) return response.data.student
        if (!isNil(response.data.sensei)) return response.data.sensei
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateAbout(accountId, isStudent, updateHeadline, headline, bio) {
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
        if (isStudent && !isNil(response.data.student)) return response.data.student
        if (!isNil(response.data.sensei)) return response.data.sensei
        return false
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateWorkDetails(accountId, isStudent, isIndustry, industry, occupation) {
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
        if (isStudent && !isNil(response.data.student)) return response.data.student
        if (!isNil(response.data.sensei)) return response.data.sensei
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
