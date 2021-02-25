import apiClient from 'services/axios'
import { resetUser, createUserObj, createAdminObj } from 'redux/selectors'

export function getLocalUserData() {
  return localStorage.getItem('user') === null
    ? resetUser
    : JSON.parse(localStorage.getItem('user'))
}

const setLocalAccessToken = accessToken => {
  localStorage.removeItem('accessToken')
  localStorage.setItem('accessToken', accessToken)
}

const setLocalUserData = (user, isAdmin) => {
  if (isAdmin) {
    user = createAdminObj(user, true)
  } else {
    user = createUserObj(user, true)
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
      if (response) {
        const { accessToken } = response.data
        const { user } = response.data
        if (accessToken) {
          setLocalAccessToken(accessToken)
          setLocalUserData(user)
        }
        return user
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
      if (response) {
        const { accessToken } = response.data
        const { user } = response.data
        if (accessToken) {
          setLocalAccessToken(accessToken)
        }
        return user
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getUser(accountId) {
  return apiClient
    .get(`/user/${accountId}`)
    .then(response => {
      if (response) return response.data.user
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
      if (response) {
        if (isStudent) return response.data.student
        return response.data.sensei
      }
      return false
    })
    .catch(err => console.log(err))
}
