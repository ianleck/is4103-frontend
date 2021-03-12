import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function createLesson(courseId) {
  const url = `/course/lesson/${courseId}`
  return apiClient
    .post(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateLesson(lessonId, payload) {
  const url = `/lesson/${lessonId}`
  return apiClient
    .put(url, { updateLesson: { ...payload } })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
