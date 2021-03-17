import apiClient from 'services/axios'
import { isNil } from 'lodash'

export async function getCart() {
  return apiClient
    .get(`/cart`, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function addCourseToCart(courseId) {
  return apiClient
    .post(`/cart/course`, { courseId }, { withCredentials: true })
    .then(response => {
      console.log(response)
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function addMentorshipListingToCart(mentorshipContractId) {
  return apiClient
    .post(`/cart/mentorshipListing`, { mentorshipContractId }, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function deleteFromCart(courseIds, mentorshipListingIds) {
  return apiClient
    .delete(`/cart`, { data: { courseIds, mentorshipListingIds } }, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
