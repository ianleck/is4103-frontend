import apiClient from 'services/axios'
import store from 'store'

const resetUser = {
  accountId: '',
  contactNumber: '',
  createdAt: '',
  email: '',
  emailVerified: '',
  firstName: '',
  lastName: '',
  paypalId: '',
  status: '',
  updatedAt: '',
  userType: '',
  username: '',
  authorized: false,
  loading: false,
  requiresProfileUpdate: false,
}

const allocUserDataToStorage = (accessToken, data) => {
  store.set('accessToken', accessToken)
  localStorage.setItem('accessToken', accessToken)
  data.user.authorized = true
  localStorage.setItem('user', JSON.stringify(data.user))
}

export async function login(email, password) {
  console.log('this email:', email)
  console.log('this password:', password)
  return apiClient
    .post('/user/login', {
      email,
      password,
    })
    .then(response => {
      console.log('loginResponse: ', response)
      if (response.data) {
        const { accessToken } = response.data
        if (accessToken) {
          allocUserDataToStorage(accessToken, response.data)
        }
        return response.data.user
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
      console.log('registerResponse: ', response)
      if (response) return true
      return false
    })
    .catch(err => console.log(err))
}

export async function currentAccount() {
  let user = localStorage.getItem('user')
  if (user) {
    user = JSON.parse(user)
    return user
  }
  localStorage.setItem('user', JSON.stringify(resetUser))
  return resetUser
}

export async function logout() {
  store.remove('accessToken')
  store.remove('user')
  store.set('user', resetUser)
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  return true
}

export async function updateProfile(id, firstName, lastName, contactNumber) {
  return apiClient
    .post('/updateProfile', {
      id,
      firstName,
      lastName,
      contactNumber,
    })
    .then(response => {
      if (response) {
        const { accessToken } = response.data
        if (accessToken) {
          store.set('accessToken', accessToken)
        }
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
