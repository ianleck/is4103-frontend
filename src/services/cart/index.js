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
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function addMentorshipPassToCart(mentorshipContractId, numSlots) {
  return apiClient
    .post(`/cart/mentorship`, { mentorshipContractId, numSlots }, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateMentorshipPassCount(cartId, mentorshipListingId, numSlots) {
  return apiClient
    .put(`/cart?cartId=${cartId}&mentorshipListingId=${mentorshipListingId}&numSlots=${numSlots}`, {
      withCredentials: true,
    })
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

export async function checkOut(cartId) {
  return apiClient
    .post(`/paypal/order/create`, { cartId }, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function capturePayment(paymentId, token, payerID, cartId) {
  return apiClient
    .post(
      `/paypal/order/capture?paymentId=${paymentId}&token=${token}&PayerID=${payerID}&cartId=${cartId}`,
      {
        withCredentials: true,
      },
    )
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function upsellCheckout() {
  return apiClient
    .get(`/cart/checkout`)
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function upsellOnMentorships(mentorshipListingId) {
  return apiClient
    .get(`/cart/mentorship/${mentorshipListingId}`)
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function upsellOnCourses(courseId) {
  return apiClient
    .get(`/cart/course/${courseId}`)
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
