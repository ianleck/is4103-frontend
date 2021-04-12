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
  const url = `/course/lesson/${lessonId}`
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

export async function deleteLesson(lessonId) {
  const url = `/course/lesson/${lessonId}`
  return apiClient
    .delete(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function deleteLessonVideo(lessonId) {
  const url = `/upload/lesson/video/${lessonId}`
  return apiClient
    .delete(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function deleteAssessmentVideo(lessonId) {
  const url = `/upload/lesson/assessment/${lessonId}`
  return apiClient
    .delete(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function deleteLessonFile(lessonId) {
  const url = `/upload/lesson/file/${lessonId}`
  return apiClient
    .delete(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getCommentsByLessonId(lessonId) {
  const url = `/comment/lesson/${lessonId}`
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

export async function addCommentToLesson(lessonId, payload) {
  const url = `/comment/lesson/${lessonId}`
  return apiClient
    .post(url, { comment: { ...payload } })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function deleteComment(commentId) {
  const url = `/comment/${commentId}`
  return apiClient
    .delete(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function markLessonAsCompleted(courseContractId, lessonId) {
  const url = `/course/contract/lesson/${courseContractId}/${lessonId}`
  return apiClient
    .put(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
