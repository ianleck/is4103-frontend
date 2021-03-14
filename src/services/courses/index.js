import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function getCourses() {
  const url = `/course/`
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

export async function getCourseById(courseId) {
  const url = `/course/${courseId}`
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

export async function getSenseiCourses(accountId, adminVerified, visibility) {
  let filterString = `adminVerified=${adminVerified}&visibility=${visibility}`
  if (isNil(adminVerified)) filterString = `visibility=${visibility}`
  if (isNil(visibility)) filterString = `adminVerified=${adminVerified}`
  const url = `/course/sensei/${accountId}?${filterString}`
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

export async function createCourse(payload) {
  const url = `/course/`
  return apiClient
    .post(url, { newCourse: { ...payload } })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateCourse(courseId, payload) {
  const url = `/course/${courseId}`
  return apiClient
    .put(url, { updatedCourse: { ...payload } })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}