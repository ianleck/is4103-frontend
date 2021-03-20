import axios from 'axios'
import { notification } from 'antd'
import { isNil } from 'lodash'
import { showNotification } from 'components/utils'
import { ERROR } from 'constants/notifications'

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  /* 
  For external device support (e.g. Mobile Phone)
  Set local IP address instead of calling localhost:
  backend/index.ts: res.header('Access-Control-Allow-Origin', 'http://192.168.50.254:3000');
  frontend/axios/index.js: apiClient.baseURL: 'http://192.168.50.254:5000/api',
  */
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
})

apiClient.interceptors.request.use(request => {
  const accessToken = localStorage.getItem('accessToken')
  if (!isNil(accessToken)) {
    request.headers.Authorization = `Bearer ${accessToken}`
    // request.headers.AccessToken = accessToken
  }
  return request
})

apiClient.interceptors.response.use(undefined, apiResponse => {
  if (!isNil(apiResponse.response.data)) {
    if (!isNil(apiResponse.response.data.error)) {
      if (!isNil(apiResponse.response.data.error.message)) {
        notification.warning({
          message: apiResponse.response.data.error.message,
        })
      }
    } else if (!isNil(apiResponse.response.data.message))
      showNotification('warning', ERROR, apiResponse.response.data.message)
    else showNotification('warning', ERROR, apiResponse.response.data)
  }
  return { success: false }
})

export default apiClient
