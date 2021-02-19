import jwt from 'jsonwebtoken'
import mock from '../mock'

const users = [
  {
    id: 1,
    name: 'Super Admin',
    avatar: '',
    role: 'admin',
    // Add database columns from backend
    username: 'admin',
    password: 'demo123',
    firstName: 'Yi Bin',
    lastName: 'Soh',
    emailVerified: true,
    email: 'admin',
    contactNumber: 90001231,
    status: 'ACTIVE',
    userTypeEnum: 'ADMIN',
  },
  {
    id: 2,
    name: 'Student',
    avatar: '',
    role: 'student',
    // Add database columns from backend
    username: 'student',
    password: 'demo123',
    firstName: 'Lawrence',
    lastName: 'Lim',
    emailVerified: true,
    email: 'student',
    contactNumber: 90001232,
    status: 'ACTIVE',
    userTypeEnum: 'STUDENT',
  },
  {
    id: 3,
    name: 'Sensei',
    avatar: '',
    role: 'sensei',
    // Add database columns from backend
    username: 'sensei',
    password: 'demo123',
    firstName: 'Natalie',
    lastName: 'Loke',
    emailVerified: true,
    email: 'sensei',
    contactNumber: 90001233,
    status: 'ACTIVE',
    userTypeEnum: 'SENSEI',
  },
]

const jwtConfig = {
  secret: 'RM8EPpgXwovR9fp6ryDIoGHAB6iHsc0fb',
  expiresIn: 1 * 24 * 60 * 60 * 1000,
}

mock.onPost('/api/auth/login').reply(request => {
  const { email, password } = JSON.parse(request.data)
  const user = users.find(item => item.email === email && item.password === password)
  const error = user ? 'Something went wrong.' : 'Login failed, please try again'

  if (user) {
    const userData = Object.assign({}, user)
    delete userData.password
    userData.accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    }) // generate jwt token

    return [200, userData]
  }

  return [401, error]
})

mock.onPost('/api/auth/register').reply(request => {
  const { username, email, password } = JSON.parse(request.data)
  const isAlreadyRegistered = users.find(user => user.email === email)

  if (!isAlreadyRegistered) {
    const user = {
      id: users.length + 1,
      email,
      password,
      avatar: '',
      role: 'student',
      username,
      status: 'ACTIVE',
      userTypeEnum: 'STUDENT',
    }
    users.push(user)

    const userData = Object.assign({}, user)
    delete userData.password
    userData.accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    })

    return [200, userData]
  }

  return [401, 'This email is already in use.']
})

mock.onGet('/api/auth/account').reply(request => {
  const { AccessToken } = request.headers
  if (AccessToken) {
    const { id } = jwt.verify(AccessToken, jwtConfig.secret)
    const userData = Object.assign(
      {},
      users.find(item => item.id === id),
    )
    delete userData.password
    userData.accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    }) // refresh jwt token

    return [200, userData]
  }

  return [401]
})

mock.onGet('/api/auth/logout').reply(() => {
  return [200]
})

mock.onPost('/api/auth/updateProfile').reply(request => {
  const { id, firstName, lastName, contactNumber } = JSON.parse(request.data)
  const currentUserIndex = users.findIndex(user => user.id === id)

  if (currentUserIndex !== -1) {
    users[currentUserIndex].firstName = firstName
    users[currentUserIndex].lastName = lastName
    users[currentUserIndex].contactNumber = contactNumber

    const userData = Object.assign({}, users[currentUserIndex])
    userData.accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    }) // refresh jwt token

    return [200, userData]
  }

  return [401, 'The current user profile could not be updated.']
})
