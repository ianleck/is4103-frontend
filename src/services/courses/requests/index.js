import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function getCourseRequests() {
  const url = `/course/all/request`
  return apiClient
    .get(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getCourseRequestDtls(requestId) {
  const url = `/course/request/${requestId}`
  return apiClient
    .get(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
