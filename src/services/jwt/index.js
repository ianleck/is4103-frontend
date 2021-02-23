import apiClient from 'services/axios'
import store from 'store'
import { resetUser } from 'redux/selectors'

/*
All LocalStorage interactions will only happen in this file.
All other files must use Redux state (and not LocalStorage) 
to prevent confusion in which copy of user data to access.
The purpose of LocalStorage usage is to persist the Login status
of the current user upon refreshing the webpage.
LocalStorage should not contain heavy data, but only
the necessary basic user data such as Access Token.
*/
const getUserDataFromStorage = () => {
  return localStorage.getItem('user') === null
    ? resetUser
    : JSON.parse(localStorage.getItem('user'))
}

export async function getLocalUserData() {
  return getUserDataFromStorage()
}

const addLocalAttributes = (user, isAuthorised, isLoading) => {
  user.authorized = isAuthorised
  user.loading = isLoading
  user.requiresProfileUpdate = false
  return user
}

const setLocalAccessToken = accessToken => {
  localStorage.removeItem('accessToken')
  localStorage.setItem('accessToken', accessToken)
}

const setLocalUserData = user => {
  user = addLocalAttributes(user, true, false)
  localStorage.removeItem('user')
  localStorage.setItem('user', JSON.stringify(user))
}

export async function login(email, password) {
  return apiClient
    .post('/user/login', {
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
          setLocalUserData(user)
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
  localStorage.setItem('user', JSON.stringify(resetUser))
  return true
}

export async function updateProfile(accountId, firstName, lastName, contactNumber) {
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
        const currentUser = store.get('user')
        currentUser.firstName = firstName
        currentUser.lastName = lastName
        currentUser.contactNumber = contactNumber
        setLocalUserData(currentUser)
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
