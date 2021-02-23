import axios from 'axios'
import { notification } from 'antd'

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
  if (localStorage.getItem('accessToken') !== null) {
    const accessToken = localStorage.get('accessToken')
    request.headers.Authorization = `Bearer ${accessToken}`
    // request.headers.AccessToken = accessToken
  }
  return request
})

apiClient.interceptors.response.use(undefined, error => {
  // Errors handling
  const { response } = error
  const { data } = response
  if (data) {
    notification.warning({
      message: data.error.message,
    })
  }
  return data
})

export default apiClient
