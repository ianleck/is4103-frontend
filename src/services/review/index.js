import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function addCourseReview(payload) {
  const { courseId, review } = payload
  console.log('in addCourseReview')
  console.log('review is ', review)
  return apiClient
    .post(`/review/course/${courseId}`, { review })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function editCourseReview(payload) {
  const { courseId, review } = payload
  return apiClient
    .put(`/review/course/${courseId}`, { review }, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

// export async function addMentorshipListingReview() {
//   return apiClient
//     .post(`/review/mentorship/${mentorshipListingId}`, { courseId }, { withCredentials: true })
//     .then(response => {
//       if (response && !isNil(response.data)) {
//         if (response.data.success) return response.data
//       }
//       return false
//     })
//     .catch(err => console.log(err))
// }

// export async function editMentorshipListingReview() {
//   return apiClient
//     .post(`/review/mentorship/${mentorshipListingId}`, { courseId }, { withCredentials: true })
//     .then(response => {
//       if (response && !isNil(response.data)) {
//         if (response.data.success) return response.data
//       }
//       return false
//     })
//     .catch(err => console.log(err))
// }
