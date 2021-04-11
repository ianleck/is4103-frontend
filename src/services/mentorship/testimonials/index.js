import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function createTestimonial(payload) {
  const { mentorshipListingId, accountId, testimonial } = payload
  const url = `/mentorship/testimonial/${mentorshipListingId}/${accountId}`
  return apiClient
    .post(url, { newTestimonial: { body: testimonial } })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

// Nat to finalise in a later PR
export async function editTestimonial(payload) {
  const { testimonialId } = payload
  const url = `/mentorship/testimonial/${testimonialId}`
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
